<script lang="ts">
    import { userStore } from "$lib/store.svelte";

    // Reactively grab the shop items so the UI updates instantly when buying/equipping
    let shopItems = $derived(userStore.getShopItems());

    function formatName(id: string) {
        return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Track which item is processing to show a loading spinner on that specific button
    let processingId = $state<string | null>(null);

    async function handlePurchase(id: string, cost: number) {
        if (userStore.points < cost) return; // Failsafe
        
        processingId = id;
        await userStore.purchase(id);
        processingId = null;
    }

    async function handleEquip(id: string) {
        processingId = id;
        await userStore.equipAvatar(id);
        processingId = null;
    }
</script>

<div class="w-full max-w-5xl mx-auto flex flex-col gap-6 h-full p-8">
    
    {#if !userStore.loggedIn}
        <div class="flex flex-col items-center justify-center h-full gap-4">
            <p class="text-xl text-base-content/70">You need to log in to access the Shop.</p>
            <a href="#/login" class="btn btn-primary">Go to Login</a>
        </div>
    {:else}
        <!-- Shop Header & Wallet -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/10">
            <div>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content">Avatar Shop</h1>
                <p class="text-base-content/60 text-sm mt-1">Spend your hard-earned coins to customize your profile. This will be how you are displayed on the leaderboard!</p>
            </div>
            
            <div class="flex items-center gap-3 bg-base-200 px-5 py-3 rounded-xl border border-base-content/5 shadow-inner">
                <span class="font-bold text-base-content/70 uppercase tracking-wider text-sm">Wallet</span>
                <div class="flex items-center gap-1.5 text-2xl font-black text-warning drop-shadow-sm">
                    <img src={userStore.coinImage} alt="Coins" class="w-7 h-7" />
                    {userStore.points}
                </div>
            </div>
        </div>

        <!-- Shop Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
            {#each shopItems as item}
                {@const canAfford = userStore.points >= item.cost}
                
                <div class="card bg-base-100 border {item.isEquipped ? 'border-success' : 'border-base-content/10'} shadow-sm hover:shadow-md transition-all flex flex-col items-center p-4 gap-4 text-center">
                    
                    <!-- Item Image -->
                    <div class="avatar relative">
                        <div class="w-24 rounded-2xl bg-base-200/50 p-2 border border-base-content/5">
                            <img src={item.image} alt={formatName(item.id)} class="object-cover drop-shadow-md" />
                        </div>
                    </div>
                    
                    <div class="flex flex-col flex-1 w-full gap-3">
                        <!-- Item Name -->
                        <div class="font-bold text-[15px] leading-tight text-base-content h-10 flex items-center justify-center">
                            {formatName(item.id)}
                        </div>
                        
                        <!-- Price or Status -->
                        <div class="flex items-center justify-center h-6 mt-auto">
                            {#if item.isOwned}
                                <span class="text-xs font-bold text-success uppercase tracking-wider opacity-80">
                                    Owned
                                </span>
                            {:else}
                                <div class="flex items-center gap-1 font-bold {canAfford ? 'text-warning' : 'text-error/70'}">
                                    <img src={userStore.coinImage} alt="Cost" class="w-4 h-4" />
                                    {item.cost}
                                </div>
                            {/if}
                        </div>

                        <!-- Action Button -->
                        <div class="w-full mt-1">
                            {#if item.isEquipped}
                                <div class="badge badge-success badge-outline w-full py-3.5 font-bold mx-auto border-2">
                                    Equipped
                                </div>
                            {:else if item.isOwned}
                                <button 
                                    class="btn btn-primary btn-sm btn-outline w-full"
                                    onclick={() => handleEquip(item.id)}
                                    disabled={processingId === item.id}
                                >
                                    {#if processingId === item.id}
                                        <span class="loading loading-spinner loading-xs"></span>
                                    {:else}
                                        Equip
                                    {/if}
                                </button>
                            {:else}
                                <button 
                                    class="btn btn-sm w-full {canAfford ? 'btn-primary' : 'btn-disabled bg-base-200 text-base-content/40'}"
                                    onclick={() => handlePurchase(item.id, item.cost)}
                                    disabled={!canAfford || processingId === item.id}
                                >
                                    {#if processingId === item.id}
                                        <span class="loading loading-spinner loading-xs"></span>
                                    {:else}
                                        Buy
                                    {/if}
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>