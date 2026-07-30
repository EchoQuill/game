<script lang="ts">
    import { onMount } from "svelte";
    import { Trophy, Medal, Crown } from "lucide-svelte";

    import { userStore } from "$lib/store.svelte";
    import { avatarImages } from "$lib/images"
    import {device} from "$lib/device.svelte"

    // Create an interface of json resp format
    interface LeaderboardUser {
        username: string;
        currency: number;
        avatar: string;
        createdAt: string;
    }

    let users = $state<LeaderboardUser[]>([]);
    let loading = $state(true);

    onMount(async () => {
        const fetchedUsers = await userStore.get_users();
        
        if (fetchedUsers) {
            // Sort the array so the highest currency is at the top (index 0)
            users = fetchedUsers.sort((a: LeaderboardUser, b: LeaderboardUser) => b.currency - a.currency);
        }
        
        loading = false;
    });

    // Helps get avatar of user from `avatarImages`
    function getAvatar(avatarKey: string) {
        return avatarImages[avatarKey] || avatarImages.newbie;
    }

</script>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-6 h-full p-3">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/10">
        <div class="flex items-center gap-4">
            <div class="p-3 bg-warning/20 text-warning rounded-xl">
                <Trophy size={32} />
            </div>
            <div>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content">Leaderboard</h1>
                <p class="text-base-content/60 text-sm mt-1">See who has the most coins across the game!</p>
            </div>
        </div>
    </div>

    <!-- Leaderboard List -->
    <div class="bg-base-200/50 rounded-2xl p-4 sm:p-6 border border-base-content/5 flex-1 shadow-inner">
        {#if loading}
            <div class="flex flex-col items-center justify-center h-40 gap-3 text-base-content/50">
                <span class="loading loading-spinner loading-lg text-primary"></span>
                <span class="font-semibold text-sm">Fetching rankings...</span>
            </div>
        {:else if users.length === 0}
            <div class="text-center p-10 text-base-content/50">
                <p class="text-lg font-semibold">No users found.</p>
            </div>
        {:else}
            <div class="flex flex-col gap-3">
                {#each users as user, index}
                    {@const isCurrentUser = userStore.loggedIn && userStore.username === user.username}
                    {@const isFirst = index === 0}
                    {@const isSecond = index === 1}
                    {@const isThird = index === 2}
                    
                    <div class="flex items-center gap-4 p-3 sm:p-4 rounded-xl border transition-all 
                        {isCurrentUser ? 'border-primary bg-primary/10 shadow-sm' : 'border-base-100 bg-base-100 shadow-sm hover:shadow-md'}">
                        
                        <!-- Rank Number & Medals -->
                        <div class="w-10 sm:w-12 flex justify-center items-center font-black text-lg sm:text-xl">
                            {#if isFirst}
                                <Crown class="text-warning drop-shadow-sm" size={28} />
                            {:else if isSecond}
                                <Medal class="text-slate-400 drop-shadow-sm" size={26} />
                            {:else if isThird}
                                <Medal class="text-amber-700 drop-shadow-sm" size={26} />
                            {:else}
                                <span class="text-base-content/40">#{index + 1}</span>
                            {/if}
                        </div>

                        <!-- Avatar -->
                        <div class="avatar">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 
                                {isFirst ? 'border-warning ring ring-warning/30' : isCurrentUser ? 'border-primary' : 'border-base-300'} bg-base-200">
                                <img src={getAvatar(user.avatar)} alt="{user.username}'s avatar" class="object-cover" />
                            </div>
                        </div>

                        <!-- Username -->
                        <div class="flex-1 overflow-hidden">
                            <div class="font-bold text-lg sm:text-xl truncate text-base-content flex items-center gap-2">
                                {user.username}
                                {#if isCurrentUser}
                                    <div class="badge badge-primary badge-sm">You</div>
                                {/if}
                            </div>
                            <div class="text-xs text-base-content/50">
                                {#if device.deviceType!="Mobile"}
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                {:else}
                                    <span class="flex text-accent-content"> Points: <img src={userStore.coinImage} alt="Coins" class="w-4 h-4" /><span class="text-primary"> {user.currency}</span></span>
                                {/if}
                            </div>
                        </div>

                        <!-- Coins / Currency -->
                        {#if device.deviceType!="Mobile"}
                            <div class="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-base-200 rounded-lg border border-base-content/5">
                                <img src={userStore.coinImage} alt="Coins" class="w-5 h-5 sm:w-6 sm:h-6" />
                                <span class="font-black text-warning text-lg sm:text-xl drop-shadow-sm">
                                    {user.currency}
                                </span>
                            </div>
                        {/if}
                        
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>