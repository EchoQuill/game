<script lang="ts">
    import "../app.css";
    import { House, User, Gamepad2, Menu } from "lucide-svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { device } from "$lib/device.svelte";
    import { userStore } from "$lib/store.svelte";

    import gamepad from "$lib/assets/guess_game_icons/gamepad.png"

    let icon = "/site_icon.png";

    let { children } = $props();

    // Lucide Svelte removed brand related images due to: https://github.com/lucide-icons/lucide/blob/main/BRAND_LOGOS_STATEMENT.md
    const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>`;

    const routes = [
        { path: "#/", label: "Home", icon: House, isSvgString: false },
        { path: "#/login", label: "Login", icon: User, isSvgString: false },
        { path: "#/games", label: "Games", icon: Gamepad2, isSvgString: false },
        { path: "https://github.com/EchoQuill/game", label: "GitHub", icon: githubSvg, isSvgString: true }
    ];

    let currentRoute = $derived(page.url.hash || "#/");

    onMount(async () => {
        document.documentElement.dataset.theme = "strawberry";
        await userStore.initAutoLogin()
    });
</script>

<div class="h-screen flex flex-col overflow-hidden">
    <nav
        class="navbar bg-base-200/90 shrink-0 sticky top-0 z-40 w-full shadow-sm backdrop-blur-3xl px-4"
    >
        <div class="flex-1 flex-nowrap flex-column">
            <a href="#/" class="btn btn-ghost text-xl font-bold"
                ><img src={gamepad} alt="Site Icon" height="40" width="40" /> game</a
            >
        </div>

        <div class="hidden md:flex flex-none">
            <ul class="menu menu-horizontal px-1 gap-2">
                {#each routes as item}
                    <li>
                        <a
                            href={item.path}
                            class:active={currentRoute === item.path}
                            class="flex items-center gap-2 rounded-lg"
                        >
                            {#if item.isSvgString}
                                {@html item.icon}
                            {:else}
                                {@const Icon = item.icon as any}
                                <Icon size={18} />
                            {/if}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="dropdown dropdown-end md:hidden flex-none">
            <div
                tabindex="0"
                role="button"
                class="btn btn-square btn-ghost"
                aria-label="Menu"
            >
                <Menu />
            </div>
            <ul
                class="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-4 w-52 p-2 shadow-lg"
            >
                {#each routes as item}
                    <li>
                        <a
                            href={item.path}
                            class:active={currentRoute === item.path}
                            class="flex items-center gap-2 py-3"
                        >
                            {#if item.isSvgString}
                                {@html item.icon}
                            {:else}
                                {@const Icon = item.icon as any}
                                <Icon size={18} />
                            {/if}
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </nav>

    <main
        class="flex-1 p-4 md:p-8 flex justify-center items-stretch overflow-y-auto"
    >
        <div
            class="card w-full h-full bg-base-300/90 justify-center items-center {device.deviceType ===
            'Desktop'
                ? 'max-w-5xl mx-auto px-6'
                : ''}"
        >
            {@render children()}
        </div>
    </main>
</div>
