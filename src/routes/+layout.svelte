<script lang="ts">
    import "../app.css";
    import { House, Gamepad2, Menu } from "lucide-svelte";
    import { page } from "$app/state";
	import { onMount } from "svelte";

    let { children } = $props();

    const routes = [
        { path: "#/", label: "Home", icon: House },
        { path: "#/game", label: "Game", icon: Gamepad2 },
    ];

    let currentRoute = $derived(page.url.hash || "#/");

	onMount(async () => {
		// This is like a patchwork atm, we need proper fetching and cache themes user selects
		// for that we also need to allow users to pick theme somewhere as well
		// we could like aim for 6 themes perhaps.
		document.documentElement.dataset.theme = "caramellatte";
	});
</script>

<div class="min-h-screen flex flex-col">
    <nav
        class="navbar bg-base-200/90 sticky top-0 z-40 w-full shadow-sm backdrop-blur-3xl px-4"
    >
        <div class="flex-1">
            <a href="#/" class="btn btn-ghost text-xl font-bold">game</a>
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
                tabindex="0"
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

    <!-- Page content here -->
    <main class="flex-1 p-4">
        {@render children()}
    </main>
</div>
