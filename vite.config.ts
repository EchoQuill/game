import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	// Check if anything causes issues with Github Pages..
	server: {
		host: true,
		strictPort: true,
		hmr: {
			clientPort: 5173
		}
	}
});