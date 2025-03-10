import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const modulePath = 'node_modules/@skeletonlabs/skeleton/dist/themes';
const files = readdirSync(modulePath);
const fileContents = files.map(file => {
	return {
		name: file.substring(0,file.indexOf('.')),
		content: readFileSync(join(modulePath, file), 'utf-8')
	}
})

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		allowedHosts: [
			'relative-oryx-endlessly.ngrok-free.app'
		]
	},
	define: {
		THEMES: fileContents
	}
});
