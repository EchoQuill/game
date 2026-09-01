<script lang="ts">
    import { userStore } from "$lib/store.svelte";
    import { Gamepad2, ArrowRight } from "@lucide/svelte";
</script>

<div class="max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center h-full">
    <div
        class="bg-base-100 rounded-3xl border border-base-content/10 shadow-md p-6 sm:p-8 flex flex-col items-center text-center gap-5"
    >
        <div class="p-3 sm:p-4 bg-primary/20 text-primary rounded-2xl">
            <Gamepad2 class="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div>
            <h1
                class="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight"
            >
                Games....?
            </h1>
            <p class="text-base-content/70 text-sm sm:text-base mt-2 max-w-xs mx-auto">
                Hey! Charts are boring right? How about a game to keep you entertained for 10 to 15 minutes? :&gt;
            </p>
        </div>

        {#if userStore.loggedIn}
            <a href="#/games" class="btn btn-primary px-8 gap-2 font-bold">
                Yes
                <ArrowRight class="w-4 h-4" />
            </a>
        {:else}
            <div class="flex flex-col items-center gap-3 w-full">
                <p class="text-xs text-base-content/50">
                    You'll need to log in first.
                </p>
                <a href="#/login" class="btn btn-outline px-8">Log In</a>
            </div>
        {/if}
    </div>
</div>