<script lang="ts">
    import { User, Lock, ArrowRight, UserPlus, LogIn } from "lucide-svelte";
    import { userStore } from "$lib/store.svelte"; // Adjust path to your store as needed

    // State to toggle between Login and Signup mode
    let isSignup = $state(false);
    let username = $state("");
    let password = $state("");
    let errorMessage = $state("");
    let successMessage = $state("");
    let loading = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        errorMessage = "";
        successMessage = "";
        loading = true;

        if (!username || !password) {
            errorMessage = "Please fill in all fields.";
            loading = false;
            return;
        }

        if (isSignup) {
            const success = await userStore.signup(username, password);
            
            if (success) {
                successMessage =
                "Account created successfully! You can now log in.";
                isSignup = false; // Switch back to login view
            } else {
                // Task: handle errors
                errorMessage = "Failed to signup, please try again later";
            }
            
        } else {
            const success = await userStore.login(username, password);
            if (!success) {
                errorMessage = "Invalid username or password.";
            } else {
                successMessage = "Login successful!";
                // Redirect or update view here if needed
            }
        }
        loading = false;
    }
</script>

<div
    class="max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center h-full"
>
    <!-- Header Section -->
    <div class="text-center mb-6">
        <h1
            class="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight"
        >
            Game?
        </h1>
        <p class="text-base-content/70 text-sm sm:text-base mt-2">
            I have been overthinking the title for a while now.. ;(. Jump right
            back in below:
        </p>
    </div>

    <!-- Main Auth Card -->
    <div class="card bg-base-100 shadow-xl border border-base-content/10">
        <div class="card-body p-6 sm:p-8">
            <!-- Card Title with Line Flex -->
            <div class="flex items-center gap-2 mb-4">
                {#if isSignup}
                    <UserPlus class="text-primary" size={28} />
                    <h2 class="card-title text-2xl font-bold">
                        Create Account
                    </h2>
                {:else}
                    <LogIn class="text-primary" size={28} />
                    <h2 class="card-title text-2xl font-bold">Welcome Back</h2>
                {/if}
            </div>

            <!-- Feedback Alerts -->
            {#if errorMessage}
                <div class="alert alert-error text-sm py-2 mb-4">
                    <span>{errorMessage}</span>
                </div>
            {/if}
            {#if successMessage}
                <div class="alert alert-success text-sm py-2 mb-4">
                    <span>{successMessage}</span>
                </div>
            {/if}

            <!-- Form -->
            <form onsubmit={handleSubmit} class="flex flex-col gap-4">
                <!-- Username Input Field -->
                <div class="form-control">
                    <label class="label" for="username">
                        <span class="label-text font-semibold">Username</span>
                    </label>
                    <label
                        class="input input-bordered flex items-center gap-3 w-full"
                    >
                        <User size={18} class="opacity-70" />
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            bind:value={username}
                            class="grow bg-transparent focus:outline-none"
                            required
                        />
                    </label>
                </div>

                <!-- Password Input Field -->
                <div class="form-control">
                    <label class="label" for="password">
                        <span class="label-text font-semibold">Password</span>
                    </label>
                    <label
                        class="input input-bordered flex items-center gap-3 w-full"
                    >
                        <Lock size={18} class="opacity-70" />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            bind:value={password}
                            class="grow bg-transparent focus:outline-none"
                            required
                        />
                    </label>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="btn btn-primary mt-2 w-full gap-2"
                    disabled={loading || !userStore.isLoaded}
                >
                    {#if loading}
                        <span class="loading loading-spinner loading-sm"></span>
                        Processing...
                    {:else}
                        {isSignup ? "Sign Up" : "Log In"}
                        <ArrowRight size={18} />
                    {/if}
                </button>
            </form>

            <!-- Mode Switcher Footer -->
            <div class="divider my-4">OR</div>

            <div class="text-center text-sm">
                {#if isSignup}
                    <span class="text-base-content/70"
                        >Already have an account?</span
                    >
                    <button
                        class="link link-primary font-semibold ml-1"
                        onclick={() => (isSignup = false)}
                    >
                        Log in here
                    </button>
                {:else}
                    <span class="text-base-content/70">New to the game?</span>
                    <button
                        class="link link-primary font-semibold ml-1"
                        onclick={() => (isSignup = true)}
                    >
                        Create an account
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
