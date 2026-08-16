<script lang="ts">
    import "../app.css";
    import { House, User, Gamepad2, Menu, LogOut, Trophy } from "@lucide/svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { device } from "$lib/device.svelte";
    import { userStore } from "$lib/store.svelte";

    import gamepad from "$lib/assets/guess_game_icons/gamepad.png";

    let { children } = $props();

    const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>`;

    const routes = [
        { path: "#/", label: "Home", icon: House, isSvgString: false },
        { path: "#/games", label: "Games", icon: Gamepad2, isSvgString: false },
        { path: "#/leaderboard", label: "Leaderboard", icon: Trophy, isSvgString: false },
        {
            path: "https://github.com/EchoQuill/game",
            label: "GitHub",
            icon: githubSvg,
            isSvgString: true,
        },
    ];

    let currentRoute = $derived(page.url.hash || "#/");
    let paticlesInitialized = $state(false);

    import Particles, { particlesInit } from "@tsparticles/svelte";
    import { loadSlim } from "@tsparticles/slim";
    import type { ISourceOptions } from "@tsparticles/engine";

    const initEngine = async (engine: any) => {
        await loadSlim(engine);
    };

    let isMobile = $derived(device.deviceType === "Mobile");

    /*
        Credits: https://owobot.com
        I stole that, cause why not! :>

        Thanks Scoot!
    */
    let options: ISourceOptions = $derived({
        fpsLimit: isMobile ? 20 : 30,
        interactivity: {
            detectsOn: "canvas",
            events: {
                resize: true,
                onClick: {
                    enable: !isMobile,
                    mode: "push",
                },
            },
            modes: {
                push: { quantity: 2 },
            },
        },

        particles: {
            paint: {
                // https://github.com/tsparticles/tsparticles/blob/main/markdown/Options/Particles/Paint.md
                // Either the documentation is messed up, or I am stupid.. I spend HOURS trying to figure out how to color svgs ;(
                color: {
                    value: [
                        "#263830",
                        "#2e8b57",
                        "#1d6ec0",
                        "#00a884",
                        "#d97706",
                        "#ca8a04",
                        "#d91b5c",
                        "#9333ea",
                        "#4d9600",
                        "#498218",
                        "#e03e2e",
                        "#ea580c",
                        "#4c3b75",
                        "#c27803",
                        "#b91c47",
                        "#7e22ce",
                        "#00695c",
                        "#558b2f",
                    ],
                },
            },
            move: {
                direction: "none",
                enable: true,
                random: true,
                speed: isMobile ? 2 : 2.5,
                straight: false,
                outModes: { default: "bounce" }, // Makes them bounce off screen edges
            },
            collisions: {
                enable: true,
                mode: "bounce", // Bounces off other particles
                overlap: { enable: true, retries: 0 },
            },
            rotate: {
                animation: { enable: true, speed: 1.5, sync: false },
            },
            number: {
                density: { enable: true },
                value: isMobile ? 80 : 150,
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        {
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gamepad-2.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true,
                        },
                        {
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/dices.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true,
                        },
                        {
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/chess-knight.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true,
                        },
                        {
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gamepad.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true,
                        },
                    ],
                },
            },
            size: {
                value: { min: 8, max: 12 },
            },
            opacity: {
                random: true,
                value: { min: 0.3, max: 0.8 },
            },
        },
    });
    onMount(async () => {
        document.documentElement.dataset.theme = "coffee";
        await userStore.initAutoLogin();
        await particlesInit(initEngine);
        paticlesInitialized = true;
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
                            aria-label={item.label}
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

            <!-- Desktop Auth & Profile Dropdown -->
            {#if userStore.loggedIn}
                <div class="dropdown dropdown-end">
                    <div
                        tabindex="0"
                        role="button"
                        class="flex items-center gap-3 bg-base-300 hover:bg-base-100 transition-colors rounded-full py-1.5 px-3 border border-base-content/10 shadow-inner cursor-pointer tooltip tooltip-bottom"
                        data-tip="Account Options"
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
                    <!-- Desktop User Dropdown Menu -->
                    <ul
                        class="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 mt-2 z-50 border border-base-content/10"
                    >
                        <li>
                            <a href="#/profile" class="flex items-center gap-2">
                                <User size={16} /> Profile
                            </a>
                        </li>
                        <li>
                            <button
                                onclick={() => userStore.logout()}
                                class="text-error flex items-center gap-2 font-semibold"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            {:else}
                <a
                    href="#/login"
                    class="btn btn-primary btn-sm rounded-full px-6 shadow-md hover:-translate-y-0.5 transition-transform tooltip tooltip-bottom"
                    data-tip="Log in to your account"
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
                class="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-4 w-56 p-2 shadow-lg border border-base-content/10"
            >
                <!-- Mobile Auth Section -->
                {#if userStore.loggedIn}
                    <li class="mb-2">
                        <a
                            href="#/profile"
                            class="bg-base-300 rounded-lg p-2 flex flex-row justify-between items-center border border-base-content/10 active:bg-base-100"
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
                        </a>
                    </li>
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

                <!-- Mobile Logout Button -->
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
        {#if paticlesInitialized}
            <Particles {options} class="absolute inset-0 z-0" />
        {/if}
        <div
            class="card w-full h-full bg-base-300/80 justify-center items-center {device.deviceType ===
            'Desktop'
                ? 'max-w-5xl mx-auto px-6'
                : ''}"
        >
            {@render children()}
        </div>
    </main>
</div>