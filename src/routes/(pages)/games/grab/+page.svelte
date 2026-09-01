<script lang="ts">
    import { onDestroy } from 'svelte';
    import { userStore } from '$lib/store.svelte';
    import { coinImages, grabImages } from '$lib/images';
    import { Bomb, Hand, Coins, Timer } from '@lucide/svelte';
    import { scale } from 'svelte/transition';

    // Game Configuration
    const GRID_SIZE = 9;
    const DISPLAY_DURATION_MS = 1000; // How long a bomb/coin stays up
    const SPAWN_INTERVAL_MS = 750;     // Spawn rate
    const MAX_CAP = 250;               // Maximum points allowed per round
    const ROUND_TIME = 30;             // Round duration in seconds

    type TileState = 'idle' | 'coin' | 'bomb';

    interface Tile {
        id: number;
        state: TileState;
        timer: ReturnType<typeof setTimeout> | null;
    }

    let sessionScore = $state(0);
    let timeLeft = $state(ROUND_TIME);
    let isPlaying = $state(false);
    let isSaving = $state(false);
    let resultMessage = $state<string | null>(null);
    let lastOutcome = $state<"win" | "lose" | null>(null);

    let gameLoopInterval: ReturnType<typeof setInterval> | null = null;
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    // Initialize 9 grid tiles
    let tiles = $state<Tile[]>(
        Array.from({ length: GRID_SIZE }, (_, i) => ({
            id: i,
            state: 'idle',
            timer: null
        }))
    );

    function startGame() {
        if (!userStore.loggedIn) {
            resultMessage = "You must be logged in to play!";
            return;
        }

        sessionScore = 0;
        timeLeft = ROUND_TIME;
        isPlaying = true;
        resultMessage = null;
        lastOutcome = null;
        resetAllTiles();

        // Game loops
        gameLoopInterval = setInterval(spawnRandomItem, SPAWN_INTERVAL_MS);
        timerInterval = setInterval(tickTimer, 1000);
    }

    function tickTimer() {
        if (timeLeft > 1) {
            timeLeft -= 1;
        } else {
            timeLeft = 0;
            cashOut("⏱️ Time's up!");
        }
    }

    function stopGameLoops() {
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        if (timerInterval) clearInterval(timerInterval);
        gameLoopInterval = null;
        timerInterval = null;
    }

    function resetAllTiles() {
        tiles.forEach((tile) => {
            if (tile.timer) clearTimeout(tile.timer);
            tile.state = 'idle';
            tile.timer = null;
        });
    }

    function spawnRandomItem() {
        const idleIndexes = tiles
            .map((t, idx) => (t.state === 'idle' ? idx : null))
            .filter((idx): idx is number => idx !== null);

        if (idleIndexes.length === 0) return;

        const randomIndex = idleIndexes[Math.floor(Math.random() * idleIndexes.length)];
        
        // 45% chance to spawn a Bomb
        const isBomb = Math.random() < 0.45;
        const newState: TileState = isBomb ? 'bomb' : 'coin';

        tiles[randomIndex].state = newState;

        tiles[randomIndex].timer = setTimeout(() => {
            if (tiles[randomIndex]) {
                tiles[randomIndex].state = 'idle';
                tiles[randomIndex].timer = null;
            }
        }, DISPLAY_DURATION_MS);
    }

    async function handleTileClick(index: number) {
        if (!isPlaying || isSaving) return;

        const tile = tiles[index];
        if (tile.state === 'idle') return;

        if (tile.timer) {
            clearTimeout(tile.timer);
            tile.timer = null;
        }

        if (tile.state === 'coin') {
            // Reward random points between 1 and 10
            const randomReward = Math.floor(Math.random() * 10) + 1;
            sessionScore = Math.min(MAX_CAP, sessionScore + randomReward);
            tile.state = 'idle';

            // Check if user hit the max cap
            if (sessionScore >= MAX_CAP) {
                await cashOut("🎉 You reached the maximum cap of 250 points!");
            }
        } else if (tile.state === 'bomb') {
            // Hit a bomb -> Lose all session coins immediately
            tile.state = 'idle';
            triggerBombLoss();
        }
    }

    function triggerBombLoss() {
        stopGameLoops();
        isPlaying = false;
        resetAllTiles();
        
        sessionScore = 0;
        lastOutcome = 'lose';
        resultMessage = "💥 BOOM! You clicked a bomb and lost all accumulated points!";
    }

    async function cashOut(customMessage?: string) {
        stopGameLoops();
        isPlaying = false;
        resetAllTiles();

        if (sessionScore > 0) {
            isSaving = true;
            await userStore.add_balance(sessionScore);
            isSaving = false;

            lastOutcome = 'win';
            resultMessage = customMessage ?? `💰 Cashed out! You added ${sessionScore} coins to your balance.`;
        } else {
            resultMessage = customMessage ?? "Session ended with 0 coins collected.";
        }
    }

    onDestroy(() => {
        stopGameLoops();
        resetAllTiles();
    });
</script>

<div class="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 h-full p-3 px-4 sm:px-0">
    
    <!-- Game Header Card -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-content/10">
        <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div class="p-2 sm:p-3 bg-primary/20 text-primary rounded-xl shrink-0">
                <Hand class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
                <h1 class="text-xl sm:text-3xl font-extrabold text-base-content leading-tight">Grab Points</h1>
                <p class="text-base-content/60 text-xs sm:text-sm mt-0.5">Grab coins quickly! Avoid bombs or lose it all.</p>
            </div>
        </div>

        {#if userStore.loggedIn}
            <div class="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 bg-base-200 px-4 py-2.5 rounded-xl border border-base-content/5 shadow-inner">
                <span class="text-xs font-bold uppercase tracking-wider text-base-content/60">Balance</span>
                <div class="flex items-center gap-1.5 text-lg sm:text-xl font-black text-warning">
                    <img src={coinImages.point_coin} alt="Coins" class="w-5 h-5 sm:w-6 sm:h-6" />
                    {userStore.points}
                </div>
            </div>
        {/if}
    </div>

    <!-- Main Game Arena -->
    <div class="bg-base-100 rounded-3xl p-5 sm:p-8 border border-base-content/10 shadow-md flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        
        <!-- Result / Outcome Alert Banner -->
        {#if resultMessage}
            <div class="alert shadow-lg max-w-md w-full animate-bounce duration-300 p-3 sm:p-4
                {lastOutcome === 'win' ? 'bg-success/20 border-success text-success-content' : lastOutcome === 'lose' ? 'bg-error/20 border-error text-error-content' : 'bg-base-200'}">
                <span class="font-bold text-center w-full text-sm sm:text-base">{resultMessage}</span>
            </div>
            <button 
                class="btn btn-primary btn-lg w-full font-black text-lg sm:text-xl shadow-xl" 
                onclick={startGame}
                disabled={isSaving}
            >
                Start New Game
            </button>
        {/if}

        {#if !userStore.loggedIn}
            <div class="flex flex-col items-center gap-3 text-center py-6">
                <p class="text-sm sm:text-base text-base-content/70">You need to log in to play and earn coins.</p>
                <a href="#/login" class="btn btn-primary px-8">Log In Now</a>
            </div>
        {:else if !resultMessage}
            <!-- Score & Timer Bar -->
            <div class="grid grid-cols-2 gap-3 w-full max-w-md">
                <div class="bg-base-200/70 p-3 rounded-2xl border border-base-content/5 flex flex-col items-center">
                    <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-base-content/50">Round Points</span>
                    <div class="flex items-center gap-1 text-xl sm:text-2xl font-black text-warning">
                        <span>{sessionScore}</span>
                        <span class="text-xs text-base-content/40 font-normal">/ {MAX_CAP}</span>
                    </div>
                </div>
                <div class="bg-base-200/70 p-3 rounded-2xl border border-base-content/5 flex flex-col items-center">
                    <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-base-content/50">Time Left</span>
                    <div class="flex items-center gap-1.5 text-xl sm:text-2xl font-black {timeLeft <= 5 ? 'text-error animate-pulse' : 'text-primary'}">
                        <Timer class="w-5 h-5" />
                        <span>{timeLeft}s</span>
                    </div>
                </div>
            </div>

            <!-- 3x3 Grid Layout -->
            <div class="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md aspect-square">
                {#each tiles as tile, index (tile.id)}
                    <button
                        type="button"
                        onclick={() => handleTileClick(index)}
                        disabled={!isPlaying || tile.state === 'idle'}
                        class="relative h-full w-full rounded-2xl border-2 border-b-[6px] flex items-center justify-center select-none transition-all duration-150 ease-out
                            {tile.state === 'idle' && isPlaying
                                ? 'bg-base-200 border-base-content/10 border-b-base-content/20 hover:bg-base-300 hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 cursor-pointer'
                                : ''}
                            {tile.state === 'idle' && !isPlaying
                                ? 'bg-base-200/30 border-base-content/5 border-b-base-content/5 opacity-50 cursor-not-allowed'
                                : ''}
                            {tile.state === 'coin'
                                ? 'bg-warning/15 border-warning/50 border-b-warning/50 cursor-default'
                                : ''}
                            {tile.state === 'bomb'
                                ? 'bg-error/15 border-error/50 border-b-error/50 cursor-default'
                                : ''}"
                    >
                        {#if tile.state === 'coin'}
                            <img
                                in:scale={{ duration: 250, start: 0.4 }}
                                src={grabImages?.point_coin || coinImages.point_coin}
                                alt="coin"
                                class="w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-md"
                            />
                        {:else if tile.state === 'bomb'}
                            <img
                                in:scale={{ duration: 200, start: 0.4 }}
                                src={grabImages?.bomb || coinImages.point_coin}
                                alt="bomb"
                                class="tile-shake w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-md"
                            />
                        {/if}
                    </button>
                {/each}
            </div>

            <!-- Controls -->
            <div class="w-full max-w-md mt-2">
                {#if !isPlaying}
                    <button 
                        class="btn btn-primary btn-lg w-full font-black text-lg sm:text-xl shadow-xl" 
                        onclick={startGame}
                        disabled={isSaving}
                    >
                        {#if isSaving}
                            <span class="loading loading-spinner"></span> Saving Coins...
                        {:else}
                            Start Game
                        {/if}
                    </button>
                {:else}
                    <button 
                        class="btn btn-success btn-lg w-full font-black text-lg sm:text-xl text-success-content shadow-xl" 
                        onclick={() => cashOut()}
                    >
                        Cash Out ({sessionScore} Coins)
                    </button>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes tile-shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        20% { transform: translateX(-3px) rotate(-4deg); }
        40% { transform: translateX(3px) rotate(4deg); }
        60% { transform: translateX(-2px) rotate(-2deg); }
        80% { transform: translateX(2px) rotate(2deg); }
    }
    .tile-shake {
        animation: tile-shake 0.35s ease-in-out;
    }
</style>