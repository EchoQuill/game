<script lang="ts">
    import { Gamepad2, ArrowRight } from "@lucide/svelte";

    interface Game {
        name: string;
        source: string;
        desc: string;
        image: string;
        badge?: string;
    }

    const games: Game[] = [
        {
            name: "Coinflip",
            source: "#/games/coinflip",
            desc: "Try your luck flipping a coin! If you're lucky, double your points!",
            image: "https://placehold.co/600x400/140e0b/38bdf8?text=Coinflip&font=playfair-display",
        },
        {
            name: "Quiz",
            source: "#/games/quiz",
            desc: "Quiz related to games, see what you know and learn what you don't!",
            image: "https://placehold.co/600x400/140e0b/4ade80?text=Quiz&font=playfair-display",
        },
        {
            name: "Grab Points",
            source: "#/games/grab",
            desc: "Grab as many points as possible. But don't be greedy, as selecting bomb will make you lose all points!",
            image: "https://placehold.co/600x400/140e0b/f87171?text=Grab+Points&font=playfair-display",
        },
        {
            name: "Quiz",
            source: "#/games/quiz",
            desc: "Quiz related to games, see what you know and learn what you don't!",
            image: "https://placehold.co/600x400/140e0b/4ade80?text=Quiz&font=playfair-display",
        },
        {
            name: "Grab Points",
            source: "#/games/grab",
            desc: "Grab as many points as possible. But don't be greedy, as selecting bomb will make you lose all points!",
            image: "https://placehold.co/600x400/140e0b/f87171?text=Grab+Points&font=playfair-display",
        },
    ];
</script>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 h-full p-3 px-4 sm:px-0">
    <!-- Header Card -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-content/10">
        <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div class="p-2 sm:p-3 bg-primary/20 text-primary rounded-xl shrink-0">
                <Gamepad2 class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
                <h1 class="text-xl sm:text-3xl font-extrabold text-base-content leading-tight">
                    Games
                </h1>
                <p class="text-base-content/60 text-xs sm:text-sm mt-0.5">
                    Pick a mini-game to play and grow your coin balance!
                </p>
            </div>
        </div>
    </div>

    <!-- Games Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto">
        {#each games as item}
            <a
                href={item.source}
                class="group bg-base-100 rounded-2xl border border-base-content/10 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
                <!-- Image Container with Badge -->
                <div class="relative aspect-video w-full bg-base-200">
                    <img
                        src={item.image}
                        alt={item.name}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <!-- Card Body -->
                <div class="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                    <div class="flex flex-col gap-1.5">
                        <h2 class="text-lg sm:text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                            {item.name}
                        </h2>
                        <p class="text-xs sm:text-sm text-base-content/70 line-clamp-3 leading-relaxed">
                            {item.desc}
                        </p>
                    </div>

                    <!-- Action Link Indicator -->
                    <div class="flex items-center justify-between pt-3 border-t border-base-content/5 text-xs font-bold text-primary">
                        <span>Play Game</span>
                        <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>