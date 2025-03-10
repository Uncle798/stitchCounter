<script lang="ts">
    import StitchDisplay from '$lib/displayComponents/StitchDisplay.svelte';
   import NewPatternForm from '$lib/forms/NewPatternForm.svelte';

   import NewRowForm from '$lib/forms/NewRowForm.svelte';
    import ProjectDeleteForm from '$lib/forms/ProjectDeleteForm.svelte';
   import Header from '$lib/Header.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();
</script>
<a href="/" class="anchor">Home</a>
{#if data.project}
   
<div class="m-2">
   <Header title={data.project!.name} />
   <h1 class="h1">{data.project?.name}</h1>
   {#each data.rows as row}
   {@const {stitches} = row}
   Row number {row.number}
   {#each stitches as stitch}
      <StitchDisplay {stitch} />
   {/each}
   <NewPatternForm rowId={row.rowId} data={data.newPatternForm}/>
   {/each}
</div>
   <NewRowForm projectId={data.project?.id} data={data.newRowForm} rowNumber={data.rows.length+1}/>

   <ProjectDeleteForm projectId={data.project.id} projectName={data.project.name} data={data.projectDeleteForm}/>
{/if}