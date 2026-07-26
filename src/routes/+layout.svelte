<script lang="ts">
    import "../app.css";
    import { House, User, Gamepad2, Menu, LogOut } from "lucide-svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { device } from "$lib/device.svelte";
    import { userStore } from "$lib/store.svelte";

    import gamepad from "$lib/assets/guess_game_icons/gamepad.png";

    let { children } = $props();

    const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>`;

    // Removed Login from here since we are handling it dynamically
    const routes = [
        { path: "#/", label: "Home", icon: House, isSvgString: false },
        { path: "#/games", label: "Games", icon: Gamepad2, isSvgString: false },
        {
            path: "https://github.com/EchoQuill/game",
            label: "GitHub",
            icon: githubSvg,
            isSvgString: true,
        },
    ];

    let currentRoute = $derived(page.url.hash || "#/");

    onMount(async () => {
        document.documentElement.dataset.theme = "strawberry";
        await userStore.initAutoLogin();
    });
</script>

<div class="h-screen flex flex-col overflow-hidden">
    <nav
        class="navbar bg-base-200/90 shrink-0 sticky top-0 z-40 w-full shadow-sm backdrop-blur-3xl px-4"
    >
        <div class="flex-1 flex-nowrap flex-column">
            <a href="#/" class="btn btn-ghost text-xl font-bold">
                <img src={gamepad} alt="Site Icon" height="40" width="40" /> game
            </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex flex-none items-center gap-4">
            <ul class="menu menu-horizontal px-1 gap-2">
                {#each routes as item}
                    <li>
                        <a
                            href={item.path}
                            class:active={currentRoute === item.path}
                            class="flex items-center gap-2 rounded-lg tooltip tooltip-bottom"
                            data-tip={item.label}
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

            <!-- Desktop Auth Section -->
            {#if userStore.loggedIn}
                <a href="#/profile">
                    <div
                        class="flex items-center gap-3 bg-base-300 rounded-full py-1.5 px-3 border border-base-content/10 shadow-inner"
                    >
                        <div
                            class="flex items-center gap-1 font-extrabold text-warning"
                        >
                            <img
                                src={userStore.coinImage}
                                alt="Coins"
                                class="w-5 h-5 drop-shadow-sm"
                            />
                            <span>{userStore.points}</span>
                        </div>
                        <img
                            src={userStore.getCurrentAvatarImage()}
                            alt="Avatar"
                            class="w-8 h-8 rounded-full border-2 border-primary bg-base-100 object-cover"
                        />
                    </div>
                </a>
            {:else}
                <a
                    href="#/login"
                    class="btn btn-primary btn-sm rounded-full px-6 shadow-md hover:-translate-y-0.5 transition-transform"
                >
                    <User size={16} /> Login
                </a>
            {/if}
        </div>

        <!-- Mobile Navigation Dropdown -->
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
                class="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-4 w-56 p-2 shadow-lg"
            >
                <!-- Mobile Auth Section (At the top of the menu) -->
                {#if userStore.loggedIn}
                    <a href="#/profile">
                        <li
                            class="pointer-events-none mb-2 bg-base-300 rounded-lg p-2 flex flex-row justify-between items-center border border-base-content/10"
                        >
                            <div class="flex items-center gap-2">
                                <img
                                    src={userStore.getCurrentAvatarImage()}
                                    alt="Avatar"
                                    class="w-8 h-8 rounded-full border border-primary bg-base-100"
                                />
                                <span class="font-bold"
                                    >{userStore.username}</span
                                >
                            </div>

                            <div
                                class="flex items-center gap-1 font-bold text-warning"
                            >
                                {userStore.points}
                                <img
                                    src={userStore.coinImage}
                                    alt="Coins"
                                    class="w-4 h-4"
                                />
                            </div>
                        </li>
                    </a>
                {:else}
                    <li class="mb-2">
                        <a
                            href="#/login"
                            class="btn btn-primary btn-sm flex justify-center text-white"
                        >
                            <User size={16} /> Log In
                        </a>
                    </li>
                {/if}

                <div class="divider my-0"></div>

                <!-- Routes Loop -->
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

                <!-- Currently Logout button is only added to mobile, will need to work on this later for Desktop -->
                {#if userStore.loggedIn}
                    <div class="divider my-0"></div>
                    <li>
                        <button
                            onclick={() => userStore.logout()}
                            class="text-error flex items-center gap-2 py-3 font-semibold"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </li>
                {/if}
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
