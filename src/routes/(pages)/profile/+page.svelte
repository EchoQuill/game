<script lang="ts">
    import { userStore } from "$lib/store.svelte";
    
    // Filter shop items whenever inv updates, with whatever is owned by user
    let inventory = $derived(userStore.getShopItems().filter(item => item.isOwned));

    // A small helper to format IDs like "cooler_glasses" into "Cooler Glasses"
    function formatName(id: string) {
        return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Handle equipping and show a small loading state if needed
    let equippingId = $state<string | null>(null);
    async function handleEquip(id: string) {
        equippingId = id;
        await userStore.equipAvatar(id);
        equippingId = null;
    }
</script>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-8 h-full">
    
    {#if !userStore.loggedIn}
        <div class="flex flex-col items-center justify-center h-full gap-4">
            <p class="text-xl text-base-content/70">You need to be logged in to view your profile.</p>
            <a href="#/login" class="btn btn-primary">Go to Login</a>
        </div>
    {:else}
        <!-- Profile Header Section -->
        <div class="card bg-base-100 shadow-xl border border-base-content/10 w-full overflow-hidden">
            <!-- Decorative background banner -->
            <div class="h-32 bg-linear-to-r from-primary to-secondary w-full opacity-80"></div>
            
            <div class="card-body p-6 pt-0 relative flex-row flex-wrap sm:flex-nowrap gap-6 items-end -mt-12 sm:-mt-16">
                <!-- Avatar -->
                <div class="avatar z-10 indicator">
                    <div class="w-28 sm:w-36 rounded-full ring-4 ring-base-100 bg-base-200 shadow-lg">
                        <img src={userStore.getCurrentAvatarImage()} alt="Current Avatar" class="object-cover" />
                    </div>
                </div>

                <!-- User Info -->
                <div class="flex-1 pb-2">
                    <h1 class="text-4xl sm:text-5xl font-extrabold text-base-content tracking-tight">
                        {userStore.username}
                    </h1>
                    <div class="flex items-center gap-2 mt-2 bg-base-200/50 w-fit px-4 py-1.5 rounded-full border border-base-content/5">
                        <span class="text-sm font-semibold opacity-70 uppercase tracking-widest">Balance</span>
                        <div class="flex items-center gap-1.5 text-xl font-extrabold text-warning drop-shadow-sm">
                            <img src={userStore.coinImage} alt="Coins" class="w-6 h-6" />
                            {userStore.points}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inventory Section -->
        <div class="flex flex-col gap-4">
            <h2 class="text-3xl font-extrabold flex items-center gap-2">
                Inventory 
                <div class="badge badge-primary badge-sm sm:badge-md">{inventory.length} Items</div>
            </h2>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {#each inventory as item}
                    <div class="card bg-base-100 border border-base-content/10 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-4 gap-3 text-center">
                        <div class="avatar">
                            <div class="w-20 rounded-xl bg-base-200">
                                <img src={item.image} alt={formatName(item.id)} />
                            </div>
                        </div>
                        
                        <div class="flex flex-col flex-1 w-full justify-between gap-3">
                            <span class="font-bold text-sm leading-tight text-base-content/80">
                                {formatName(item.id)}
                            </span>
                            
                            {#if item.isEquipped}
                                <div class="badge badge-success badge-outline w-full py-3 font-semibold mx-auto">
                                    Equipped
                                </div>
                            {:else}
                                <button 
                                    class="btn btn-primary btn-sm btn-outline w-full"
                                    onclick={() => handleEquip(item.id)}
                                    disabled={equippingId === item.id}
                                >
                                    {#if equippingId === item.id}
                                        <span class="loading loading-spinner loading-xs"></span>
                                    {:else}
                                        Equip
                                    {/if}
                                </button>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>

            {#if inventory.length === 0}
                <div class="text-center p-10 border-2 border-dashed border-base-content/20 rounded-box text-base-content/50">
                    <p class="text-lg font-semibold">Your inventory is empty!</p>
                    <p class="text-sm mt-1">Weird, this shouldn't have happened. Could you try refreshing this page? If that doesn't help try clearing cache and relog back in.</p>
                </div>
            {/if}
        </div>
    {/if}
</div>