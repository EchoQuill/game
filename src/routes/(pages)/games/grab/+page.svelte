<script lang="ts">
	import { onDestroy } from 'svelte';

    import { grabImages } from '$lib/images'

	// Game Configuration
	const GRID_SIZE = 9;
	const DISPLAY_DURATION_MS = 1000; // How long a bomb/coin stays up
	const SPAWN_INTERVAL_MS = 800;    // How frequently new items spawn

	type TileState = 'idle' | 'coin' | 'bomb';

	interface Tile {
		id: number;
		state: TileState;
		timer: ReturnType<typeof setTimeout> | null;
	}

	// Reactive state
	let score = $state(0);
	let isPlaying = $state(false);
	let gameLoopInterval: ReturnType<typeof setInterval> | null = null;

	// Initialize 9 grid tiles
	let tiles = $state<Tile[]>(
		Array.from({ length: GRID_SIZE }, (_, i) => ({
			id: i,
			state: 'idle',
			timer: null
		}))
	);

	function startGame() {
		score = 0;
		isPlaying = true;
		resetAllTiles();

		// Main game loop: Pick a random idle tile every X milliseconds
		gameLoopInterval = setInterval(spawnRandomItem, SPAWN_INTERVAL_MS);
	}

	function stopGame() {
		isPlaying = false;
		if (gameLoopInterval) clearInterval(gameLoopInterval);
		resetAllTiles();
	}

	function resetAllTiles() {
		tiles.forEach((tile) => {
			if (tile.timer) clearTimeout(tile.timer);
			tile.state = 'idle';
			tile.timer = null;
		});
	}

	function spawnRandomItem() {
		// Find indexes of tiles that are currently idle
		const idleIndexes = tiles
			.map((t, idx) => (t.state === 'idle' ? idx : null))
			.filter((idx): idx is number => idx !== null);

		if (idleIndexes.length === 0) return; // Grid is full

		// Pick a random idle tile
		const randomIndex = idleIndexes[Math.floor(Math.random() * idleIndexes.length)];
		
		// 30% chance to spawn a Bomb, 70% chance for a Coin
		const isBomb = Math.random() < 0.3;
		const newState: TileState = isBomb ? 'bomb' : 'coin';

		// Set the tile state
		tiles[randomIndex].state = newState;

		// Set a timer to automatically remove the item after 1 second if not clicked
		tiles[randomIndex].timer = setTimeout(() => {
			if (tiles[randomIndex]) {
				tiles[randomIndex].state = 'idle';
				tiles[randomIndex].timer = null;
			}
		}, DISPLAY_DURATION_MS);
	}

	function handleTileClick(index: number) {
		if (!isPlaying) return;

		const tile = tiles[index];

		if (tile.state === 'idle') return; // Clicked an empty tile

		// Clear the auto-expire timeout immediately on click
		if (tile.timer) {
			clearTimeout(tile.timer);
			tile.timer = null;
		}

		if (tile.state === 'coin') {
			score += 5;
		} else if (tile.state === 'bomb') {
			score = Math.max(0, score - 15); // Penalty for clicking a bomb
		}

		// Reset tile back to idle instantly
		tile.state = 'idle';
	}

	onDestroy(() => {
		stopGame();
	});
</script>

<div class="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
	<!-- Scoreboard Header -->
	<div class="stats shadow bg-base-200 w-full text-center">
		<div class="stat">
			<div class="stat-title">Current Coins</div>
			<div class="stat-value text-primary">{score}</div>
		</div>
	</div>

	<!-- 3x3 Grid Layout -->
	<div class="grid grid-cols-3 gap-4 w-full aspect-square">
		{#each tiles as tile, index (tile.id)}
			<button
				type="button"
				onclick={() => handleTileClick(index)}
				disabled={!isPlaying}
				class="btn h-full w-full p-0 relative transition-transform duration-75 active:scale-95 flex items-center justify-center text-3xl select-none
					{tile.state === 'idle' ? 'btn-neutral' : ''}
					{tile.state === 'coin' ? 'btn-success text-success-content' : ''}
					{tile.state === 'bomb' ? 'btn-error text-error-content animate-pulse' : ''}"
			>
				{#if tile.state === 'coin'}
					<span><img src={grabImages['point_coin']} alt="point coin" class="h-4 w-4"></span>
				{:else if tile.state === 'bomb'}
					<!-- Swap with an <img> tag if you prefer PNG icons -->
					<span><img src={grabImages['bomb']} alt="bomb" class="h-4 w-4"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Controls -->
	{#if !isPlaying}
		<button class="btn btn-primary btn-wide" onclick={startGame}>
			Start Game
		</button>
	{:else}
		<button class="btn btn-outline btn-error btn-wide" onclick={stopGame}>
			End Session
		</button>
	{/if}
</div>