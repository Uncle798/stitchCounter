<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';
	import { beforeNavigate } from '$app/navigation';
	import { Menu } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
   import type { LayoutData } from './$types.js';
	interface Props {
		children: Snippet, 
		data: LayoutData
	}
	let { children, data }:Props = $props();
	interface Link {
		link: string;
		label: string;
	}
	const navLinks:Link[] = [
		{label:'Home', link: '/'},
	]
	
	let menuOpen = $state(false);
	beforeNavigate(()=> {
		menuOpen=false
	})
</script>

<Modal
	open={menuOpen}
	onOpenChange={(event) => (menuOpen = event.open)}
	triggerBase="btn bg-primary-50 dark:bg-primary-950 hover:shadow-xl hover:border-2 border-secondary-50 dark:border-secondary-950 fixed top-0 z-50"
	contentBase="bg-surface-100-900 p-2 space-y-2 shadow-xl w-[240px] h-screen"
	positionerJustify="justify-start"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: -240, duration: 400 }}
	transitionsPositionerOut={{ x: -240, duration: 400 }}
>
	{#snippet trigger()}
		<Menu class="mx-2 border-2" aria-label='Main Menu'/>
	{/snippet}
	{#snippet content()}		
	<div>
		<ul>
			{#each navLinks as link}
				<li><a href={link.link} class="anchor">{link.label}</a></li>
			{/each}
			<div class="absolute bottom-0 m-1 sm:m-2 mb-2">
				{#if data.user}
				<li><a href="/accountSettings" class="anchor">Settings</a></li>
					<form action="/logout" method="post" use:enhance>
						<li><button class="anchor" type="submit">Logout</button></li>
					</form>
				{:else}
					<li><a class="anchor" href="/login">Login</a></li>
				{/if}
			</div>
		</ul>
	</div>
	{/snippet}
</Modal>
<div class="bg-tertiary-50 dark:bg-tertiary-950 fixed top-0 right-0 left-0 h-8 text-center font-bold p-2">Stitch Counter</div>
{@render children()}
