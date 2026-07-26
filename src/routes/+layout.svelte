<script lang="ts">
    import "../app.css";
    import { House, Gamepad2, Menu } from "lucide-svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { device } from "$lib/device.svelte";
    
    let icon = "/site_icon.png";

    let { children } = $props();

    const routes = [
        { path: "#/", label: "Game", icon: House },
        { path: "#/login", label: "Login", icon: Gamepad2 },
    ];

    let currentRoute = $derived(page.url.hash || "#/");

    onMount(async () => {
        document.documentElement.dataset.theme = "strawberry";
    });
</script>

<div class="h-screen flex flex-col overflow-hidden">
    <nav
        class="navbar bg-base-200/90 shrink-0 sticky top-0 z-40 w-full shadow-sm backdrop-blur-3xl px-4"
    >
        <div class="flex-1 flex-nowrap flex-column">
            
            <a href="#/" class="btn btn-ghost text-xl font-bold"><img src={icon} alt="Site Icon" height="40" width="40"/> game</a>
        </div>

        <div class="hidden md:flex flex-none">
            <ul class="menu menu-horizontal px-1 gap-2">
                {#each routes as item}
                    {@const Icon = item.icon}
                    <li>
                        <a
                            href={item.path}
                            class:active={currentRoute === item.path}
                            class="flex items-center gap-2 rounded-lg"
                        >
                            <Icon size={18} />
                            {item.label}
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
                    {@const Icon = item.icon}
                    <li>
                        <a
                            href={item.path}
                            class:active={currentRoute === item.path}
                            class="flex items-center gap-2 py-3"
                        >
                            <Icon size={18} />
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </nav>

    <main class="flex-1 p-4 md:p-8 flex justify-center items-stretch overflow-y-auto">
        <div class="card w-full h-full bg-base-300/90 justify-center items-center {device.deviceType === 'Desktop' ? 'max-w-5xl mx-auto px-6' : ''}">
            {@render children()}
        </div>
    </main>
</div>