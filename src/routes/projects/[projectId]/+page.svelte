<script lang="ts">
   import Header from '$lib/Header.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();
</script>
<div>
   <Header title={data.project!.name} />
   <h1>{data.project?.name}</h1>
   {#each data.rows as row}
      {row}
   {/each}
</div>