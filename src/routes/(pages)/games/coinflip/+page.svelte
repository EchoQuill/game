<script lang="ts">
    /*
    Task: Perhaps add a streaks section.
    */
    import { userStore } from "$lib/store.svelte";
    import { coinImages } from "$lib/images";
    import { Coins } from "lucide-svelte";

    // Game states
    let betAmount = $state<number>(10);
    let selectedChoice = $state<"heads" | "tails">("heads");
    let isFlipping = $state(false);
    let resultMessage = $state<string | null>(null);
    let lastOutcome = $state<"win" | "lose" | null>(null);
    let displayedCoin = $state<string>(coinImages.heads_coin);

    // Quick bet options
    const presets = [10, 50, 100, 250];

    function setBet(amount: number) {
        // The UI does prevent anything more than 250 being placed as a bet, but
        // just in case! better be safe than never!
        if (amount > 250) {
            amount = 250;
        }
        if (amount < 1) {
            amount = 1;
        }
        betAmount = amount;
    }

    async function playCoinflip() {
        // Validations
        if (!userStore.loggedIn) {
            resultMessage = "You must be logged in to gamble!";
            return;
        }
        if (betAmount <= 0) {
            resultMessage = "Please enter a valid bet amount.";
            return;
        }
        if (betAmount > 250) {
            resultMessage = "Maximum bet is 250 coins!";
            return;
        }
        if (userStore.points < betAmount) {
            resultMessage = "You don't have enough coins!";
            return;
        }

        isFlipping = true;
        resultMessage = null;
        lastOutcome = null;

        // Reduce bet amount
        await userStore.reduce_balance(betAmount);

        // Change Icon to spin gif
        displayedCoin = coinImages.spin_coin;

        // Simulate flip delay (1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const winningSide: "heads" | "tails" =
            Math.random() < 0.5 ? "heads" : "tails";

        if (winningSide === "heads") {
            displayedCoin = coinImages.heads_coin;
        } else {
            displayedCoin = coinImages.tails_coin;
        }

        const won = selectedChoice === winningSide;

        if (won) {
            const payout = betAmount * 2;
            await userStore.add_balance(payout);

            lastOutcome = "win";
            resultMessage = `🎉 You won ${payout} coins! It was ${winningSide.toUpperCase()}.`;
        } else {
            lastOutcome = "lose";
            resultMessage = `😢 You lost ${betAmount} coins. It was ${winningSide.toUpperCase()}.`;
        }

        isFlipping = false;
    }
</script>

<!-- Thankfully I have AI to do the styling for me, it would be a disastor if left to me.. -->
<!-- Don't ask me what all these tailwind stuff here means, no idea! Looks like minecraft enchatment table haha -->
<div
    class="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 h-full p-8 px-4 sm:px-0"
>
    <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-content/10"
    >
        <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div
                class="p-2 sm:p-3 bg-primary/20 text-primary rounded-xl shrink-0"
            >
                <Coins class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
                <h1
                    class="text-xl sm:text-3xl font-extrabold text-base-content leading-tight"
                >
                    Coinflip Arena
                </h1>
                <p class="text-base-content/60 text-xs sm:text-sm mt-0.5">
                    Guess Heads or Tails and double your coins!
                </p>
            </div>
        </div>

        {#if userStore.loggedIn}
            <div
                class="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 bg-base-200 px-4 py-2.5 rounded-xl border border-base-content/5 shadow-inner"
            >
                <span
                    class="text-xs font-bold uppercase tracking-wider text-base-content/60"
                    >Balance</span
                >
                <div
                    class="flex items-center gap-1.5 text-lg sm:text-xl font-black text-warning"
                >
                    <img
                        src={coinImages.point_coin}
                        alt="Coins"
                        class="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    {userStore.points}
                </div>
            </div>
        {/if}
    </div>

    <!-- Main Game Arena -->
    <div
        class="bg-base-100 rounded-3xl p-5 sm:p-10 border border-base-content/10 shadow-md flex flex-col items-center justify-center gap-6 sm:gap-8 relative overflow-hidden"
    >
        <!-- Coin Visual Representation -->
        <div class="relative flex items-center justify-center my-2 sm:my-4">
            <!-- Its soo cool to have tailwind tricks like animate-pulse 
            https://tailwindcss.com/docs/animation
            -->
            <div
                class="absolute w-32 h-32 sm:w-44 sm:h-44 bg-primary/10 rounded-full blur-2xl animate-pulse"
            ></div>
            <div
                class="w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-base-200/80 border-4 border-warning/50 flex items-center justify-center shadow-2xl relative z-10 p-2 sm:p-3 transition-transform duration-300"
            >
                <img
                    src={displayedCoin}
                    alt="Coin Flip"
                    class="w-full h-full object-contain drop-shadow-md {isFlipping
                        ? 'scale-110'
                        : ''}"
                />
            </div>
        </div>

        <!-- Result / Outcome Alert Banner -->
        {#if resultMessage}
            <div
                class="alert shadow-lg max-w-md w-full animate-bounce duration-300 p-3 sm:p-4
                {lastOutcome === 'win'
                    ? 'bg-success/20 border-success text-success-content'
                    : lastOutcome === 'lose'
                      ? 'bg-error/20 border-error text-error-content'
                      : 'bg-base-200'}"
            >
                <span class="font-bold text-center w-full text-sm sm:text-base"
                    >{resultMessage}</span
                >
            </div>
        {/if}

        {#if !userStore.loggedIn}
            <div class="flex flex-col items-center gap-3 text-center">
                <p class="text-sm sm:text-base text-base-content/70">
                    You need to log in to play and gamble coins.
                </p>
                <a href="#/login" class="btn btn-primary px-8">Log In Now</a>
            </div>
        {:else}
            <!-- Controls Grid -->
            <div class="flex flex-col w-full max-w-md gap-5 sm:gap-6">
                <!-- 1. Choose Side -->
                <div class="flex flex-col gap-2">
                    <span
                        class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50"
                        >Pick a Side</span
                    >
                    <div class="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                            class="btn sm:btn-lg font-bold {selectedChoice ===
                            'heads'
                                ? 'btn-primary shadow-lg'
                                : 'btn-outline border-base-content/20'}"
                            onclick={() => (selectedChoice = "heads")}
                            disabled={isFlipping}
                        >
                            Heads
                        </button>
                        <button
                            class="btn sm:btn-lg font-bold {selectedChoice ===
                            'tails'
                                ? 'btn-primary shadow-lg'
                                : 'btn-outline border-base-content/20'}"
                            onclick={() => (selectedChoice = "tails")}
                            disabled={isFlipping}
                        >
                            Tails
                        </button>
                    </div>
                </div>

                <!-- Bet Amount & Presets -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <span
                            class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50"
                            >Bet Amount</span
                        >
                        <span
                            class="text-[10px] sm:text-xs font-semibold text-warning"
                            >Max limit: 250P</span
                        >
                    </div>

                    <div class="relative flex items-center">
                        <input
                            type="number"
                            bind:value={betAmount}
                            min="1"
                            max="250"
                            disabled={isFlipping}
                            class="input input-bordered sm:input-lg w-full font-bold pl-10 sm:pl-12 text-base sm:text-lg"
                        />
                        <span
                            class="absolute left-3.5 sm:left-4 text-warning font-bold"
                            >P</span
                        >
                    </div>

                    <div class="grid grid-cols-4 gap-1.5 sm:gap-2 mt-1">
                        {#each presets as val}
                            <button
                                class="btn btn-sm btn-outline font-semibold text-xs sm:text-sm px-0"
                                onclick={() => setBet(val)}
                                disabled={isFlipping || userStore.points < val}
                            >
                                {val}P
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Flip Button -->
                <button
                    class="btn btn-primary btn-lg w-full font-black text-lg sm:text-xl shadow-xl mt-2 sm:mt-0"
                    onclick={playCoinflip}
                    disabled={isFlipping ||
                        betAmount > userStore.points ||
                        betAmount > 250 ||
                        betAmount <= 0}
                >
                    {#if isFlipping}
                        <span class="loading loading-spinner"></span> Flipping...
                    {:else}
                        Flip Coin ({betAmount}P)
                    {/if}
                </button>
            </div>
        {/if}
    </div>
</div>
