// This file contains helpers for the Grabber game
// Goal of the game would be to grab as much safe items as possible within time limit

import { onDestroy } from "svelte";

// Game Configuration
const GRID_SIZE = 9;
const DISPLAY_DURATION_MS = 1000; // How long a bomb/coin stays up
const SPAWN_INTERVAL_MS = 800; // How frequently new items spawn

type TileState = "idle" | "coin" | "bomb";

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
        state: "idle",
        timer: null,
    })),
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
        tile.state = "idle";
        tile.timer = null;
    });
}

function spawnRandomItem() {
    // Find indexes of tiles that are currently idle
    const idleIndexes = tiles
        .map((t, idx) => (t.state === "idle" ? idx : null))
        .filter((idx): idx is number => idx !== null);

    if (idleIndexes.length === 0) return; // Grid is full

    // Pick a random idle tile
    const randomIndex =
        idleIndexes[Math.floor(Math.random() * idleIndexes.length)];

    // 30% chance to spawn a Bomb, 70% chance for a Coin
    const isBomb = Math.random() < 0.3;
    const newState: TileState = isBomb ? "bomb" : "coin";

    // Set the tile state
    tiles[randomIndex].state = newState;

    // Set a timer to automatically remove the item after 1 second if not clicked
    tiles[randomIndex].timer = setTimeout(() => {
        if (tiles[randomIndex]) {
            tiles[randomIndex].state = "idle";
            tiles[randomIndex].timer = null;
        }
    }, DISPLAY_DURATION_MS);
}

function handleTileClick(index: number) {
    if (!isPlaying) return;

    const tile = tiles[index];

    if (tile.state === "idle") return; // Clicked an empty tile

    // Clear the auto-expire timeout immediately on click
    if (tile.timer) {
        clearTimeout(tile.timer);
        tile.timer = null;
    }

    if (tile.state === "coin") {
        score += 5;
    } else if (tile.state === "bomb") {
        score = Math.max(0, score - 15); // Penalty for clicking a bomb
    }

    // Reset tile back to idle instantly
    tile.state = "idle";
}

onDestroy(() => {
    stopGame();
});
