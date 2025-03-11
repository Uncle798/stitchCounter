<script lang="ts">
   import StitchDisplay from '$lib/displayComponents/StitchDisplay.svelte';
   import NewPatternForm from '$lib/forms/NewPatternForm.svelte';

   import NewRowForm from '$lib/forms/NewRowForm.svelte';
   import ProjectDeleteForm from '$lib/forms/ProjectDeleteForm.svelte';
   import Header from '$lib/Header.svelte';
   import { onMount } from 'svelte';
   import type { PageData } from './$types';
   import { beforeNavigate, invalidateAll } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import type { Stitch } from '@prisma/client';
    import StitchDeleteForm from '$lib/forms/StitchDeleteForm.svelte';
    import { newRowFormSchema } from '$lib/formSchemas/schemas';
    import { Accordion } from '@skeletonlabs/skeleton-svelte';
   let { data }: { data: PageData } = $props();
   let wakeLock: WakeLockSentinel;
   const requestWakeLock = async () => {
      try {
         wakeLock = await navigator.wakeLock.request('screen');
         wakeLock.addEventListener('release', () => {
            console.log('Screen lock released', wakeLock.released)
         })
         console.log('Wake locked', wakeLock.released)
      } catch (error) {
         console.error(error)
      }
      return wakeLock
   }
   let selectedStitches = $state([''])
   let allStitches:Stitch[]=[]
   const wrapper = new Promise<Stitch[]>(async res => {
      const stitches = await data.stitches
      stitches.forEach((stitch) => {
         allStitches.push(stitch);
      })
      res(stitches)
   })
   function toggleAll(event:Event){
      const target = event.target as HTMLInputElement
      if(target.checked){
         allStitches.forEach((stitch) => {
            selectedStitches.push(stitch.id)
         })
      } else if(target.checked === false) {
         selectedStitches = []
      }
   }
   const deleteStitches = async () => {
      for await(const stitch of selectedStitches){
         const response = await fetch(`/api/stitch`, {
            method:'DELETE',
            body: JSON.stringify({stitchId:stitch})
         })
         await response.json()
      }
      invalidateAll()
   }
   const toggleStitch = async (stitchId:string, completed:boolean) => {
      const response = await fetch('/api/stitch', {
         method: 'POST',
         body: JSON.stringify({stitchId, completed})
      })
      const body = await response.json()
      console.log(body)
      invalidateAll()
   }
   onMount(()=> requestWakeLock())
   beforeNavigate(() => wakeLock.release())
   let accordionValue = $state([''])
</script>

<a href="/" class="anchor">Home</a>

{#await data.project}
   <div class="">
      loading project
   </div>
{:then project}
   {#await data.rows}
      loading rows
   {:then rows} 
      {#await wrapper}
         loading stitches
      {:then stitches} 
         {#if project}
         <Header title={project.name} />
         <div class="m-2" transition:fade={{duration:600}}>
            <h1 class="h1 text-center ">{project.name}</h1>
            <label for="selectAll" class="label-text">
               Select All
               <input type="checkbox" name="selectAll" id="selectAll" class="checkbox" onchange={toggleAll} checked={selectedStitches.length === allStitches.length}>
            </label>
            <button type="button" class="btn rounded-lg preset-filled-primary-50-950 text-wrap my-2" onclick={deleteStitches}>Delete Stitches</button>
            <Accordion value={accordionValue} onValueChange={(event) => (accordionValue = event.value)} >
                  {#each rows as row}
                  {@const rowStitches = stitches.filter((stitch) => stitch.rowId === row.rowId)}
                     <Accordion.Item value={row.number.toString()}>
                        {#snippet control()}Row number {row.number.toString()}{/snippet}
                        {#snippet panel()}
                           {#each rowStitches as stitch}
                              <div class="flex gap-3 align-middle">
                                 <input type="checkbox" class='checkbox' name={stitch.id} id={stitch.id} bind:group={selectedStitches} value={stitch.id}>
                                 <div>{stitch.number}</div>
                                 <div>{stitch.type}</div>
                                 <div><button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit sm:w-full" onclick={()=>toggleStitch(stitch.id, stitch.completed)}>
                                    {#if stitch.completed}
                                       Undo Stitch
                                    {:else}
                                       Complete Stitch
                                    {/if}
                                 </button></div>
                              </div>
                           {/each}
                           <NewPatternForm data={data.newPatternForm}  rowId={row.rowId} />
                        {/snippet}
                     </Accordion.Item>
                  {/each}
            </Accordion>
            <NewRowForm projectId={project.id} data={data.newRowForm} rowNumber={rows.length+1}/>
            <ProjectDeleteForm projectId={project.id} projectName={project.name} data={data.projectDeleteForm}/>
         </div>
         {/if}
      {/await}
   {/await}   
{/await}