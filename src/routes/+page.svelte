<script lang="ts">
    import dancing_kitten from "$lib/assets/dancing_kitten.gif";
    import { device } from "$lib/device.svelte";

    import Particles, { particlesInit } from "@tsparticles/svelte";
    import { loadSlim } from "@tsparticles/slim";

    void particlesInit(async (engine) => {
        await loadSlim(engine);
    });

    let isMobile = $derived(device.deviceType === 'Mobile');

    let options = $derived({
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
            color: {
                value: ["#7DBCEB", "#FFDA00"],
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
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/circle.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true,
                        },
                        {
                            src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/star.svg",
                            width: 32,
                            height: 32,
                            replaceColor: true, 
                        },
                    ],
                },
            },
            size: {
                value: { min: 8, max: 30 },
            },
            opacity: {
                random: true,
                value: { min: 0.05, max: 0.5 },
            },
        },
    });
</script>

<div
    class="max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center h-full"
>
    <div class="text-center mb-6 block-particle">
        <h1
            class="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight"
        >
            Whoops
        </h1>
        <p class="text-base-content/70 text-sm sm:text-base mt-2">
            This page isn't done yet! ;(. Enjoy a dancing cat instead, while we
            work on redirecting you to proper page!
        </p>
    </div>
    <div class="flex justify-center">
        <img src={dancing_kitten} alt="Dancing cat GIF" />
    </div>
</div>
