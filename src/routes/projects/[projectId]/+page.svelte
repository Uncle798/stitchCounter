<script lang="ts">
   import StitchDisplay from '$lib/displayComponents/StitchDisplay.svelte';
   import NewPatternForm from '$lib/forms/NewPatternForm.svelte';

   import NewRowForm from '$lib/forms/NewRowForm.svelte';
   import ProjectDeleteForm from '$lib/forms/ProjectDeleteForm.svelte';
   import Header from '$lib/Header.svelte';
   import { onMount } from 'svelte';
   import type { PageData } from './$types';
   import { beforeNavigate, invalidateAll, invalidate } from '$app/navigation';
   import { fade } from 'svelte/transition';
   import type { Row, Stitch, StitchType } from '@prisma/client';
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
   
   async function toggleAll(event:Event){
      const target = event.target as HTMLInputElement
      if(target.checked){
        (await data.stitches).forEach((stitch) => {
            selectedStitches.push(stitch.id)
         })
      } else if(target.checked === false) {
         selectedStitches = []
      }
   }
   let rowSelectAllChecked = $state(false)
   async function toggleRow(event:Event, rowId:string){
      const target = event.target as HTMLInputElement
      if(target.checked){
         const rowStitches = (await data.stitches).filter((stitch) => stitch.rowId === rowId);
         if(rowStitches){
            rowStitches.forEach((stitch) => {
               selectedStitches.push(stitch.id);
            })
         }
      } else if(target.checked === false) {
         selectedStitches = [];
      }
   }
   const copyStitches = async() =>{
      let i = 1;
      selectedStitches.forEach(async (stitchId) => {
         const stitches = await data.stitches;
         const stitch = stitches.find((s) => s.id === stitchId);
         const rowStitches = stitches.filter((s) => s.rowId === stitch?.rowId);
         if(stitch){
            createStitch(stitch.rowId, stitch.type, rowStitches.length+i)
         }
         i++;
      })
      invalidateAll()
   }
   const createStitch = async (rowId:string, type:StitchType, stitchNumber:number) => {
      const response = await fetch(`/api/stitch`, {
         method: 'POST',
         body: JSON.stringify({rowId, type, stitchNumber})
      })
      await response.json()
      invalidateAll();
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
         method: 'PATCH',
         body: JSON.stringify({stitchId, completed})
      })
      const body = await response.json()
      console.log(body)
      const project = await data.project
      invalidateAll()
   }
   const deleteRow = async (rowId:string) => {
      const response = await fetch(`/api/rows`, {
         method: 'Delete',
         body: JSON.stringify({rowId})
      })
      invalidateAll();
   }
   onMount(()=> requestWakeLock())
   beforeNavigate(() => {
      if(wakeLock){
         wakeLock.release()
      }
   })
   let accordionValue = $state([''])
   let sewingMode = $state(false)
   let previousStitch = $state<Stitch>({} as Stitch)
   let currentStitch = $state<Stitch>({} as Stitch)
   let nextStitch = $state<Stitch | undefined>()
   async function getNextStitch(stitchId:string){
      const stitches = await data.stitches
      const stitch = stitches.find((s) => s.id === stitchId)
      console.log('currentStitch', currentStitch)
      if(stitch){
         const stitchNum = stitch.number;
         const rowStitches = stitches.filter((s) => s.rowId === stitch.rowId)
         if(stitchNum < rowStitches.length){
            nextStitch = rowStitches.find((s) => s.number === stitchNum +1 );
            previousStitch = currentStitch
            currentStitch= stitch
            console.log('nextStitch',nextStitch)
         } else {
            const allRows = await data.rows;
            const row = allRows.find((row) => row.rowId === stitch.rowId);
            console.log(row?.number)
            const nextRow = allRows.find((r) => r.number === row!.number+1);
            console.log(nextRow)
            if(nextRow){
               nextStitch = stitches.find((s)=> {
                  return s.rowId === nextRow.rowId && s.number === 1;
               })
               previousStitch = currentStitch
            }
         }
      }
   }
   const startSewingMode = async (startingStitchId:string) => {
      const stitches = await data.stitches
      const startingStitch=stitches.find((stitch) => stitch.id === startingStitchId)
      if(startingStitch){
         currentStitch=startingStitch
         previousStitch=currentStitch
      }
      getNextStitch(currentStitch.id)
      sewingMode = true
   }
   async function finishCurrentStitch(stitchId:string) {
      await toggleStitch(currentStitch.id, currentStitch.completed)
      await getNextStitch(nextStitch!.id)
   }
   async function completeFullRow(rowId:string) {
      const rowStitches = (await data.stitches).filter((stitch) => stitch.rowId === rowId);
      rowStitches.forEach(async (stitch) => {
         await toggleStitch(stitch.id, true);
      })
   }
   const allStitchesCompleted = $derived((stitches:Stitch[]) => {
      let completedStitches = 0;
      stitches.forEach((stitch) => {
         if(stitch.completed){
            completedStitches ++;
         }
      })
      if(completedStitches === stitches.length){
         return true
      } else {
         return false
      }
   })
</script>

<a href="/" class="anchor">Home</a>

{#await data.project}
   <div class="m-2">
      loading project
   </div>
{:then project}
   {#await data.rows}
      <div class="m-2">
         loading rows
      </div>
   {:then rows} 
      {#await data.stitches}
         loading stitches
      {:then stitches} 
         {#if project}
         <Header title={project.name} />
         {#if sewingMode}
            <div class="m-2">
               Previous stitch {previousStitch.number} {previousStitch.type}
            </div>
            <div>Current Stitch {currentStitch.number} {currentStitch.type}</div>
            <div>Next Stitch {nextStitch?.number} {nextStitch?.type}</div>
            <button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit" onclick={()=>finishCurrentStitch(currentStitch.id)}>Finish current stitch</button>
            <button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit" onclick={()=>sewingMode=false}>Exit sewing mode</button>
         {:else}
         <div class=" sticky top-8 bg-tertiary-50-950 grid grid-cols-3">
            <button type="button" class="btn rounded-lg preset-filled-primary-50-950 text-wrap " onclick={copyStitches}>Copy selected Stitches</button>
            <h1 class="h1 text-center sticky top-8">{project.name}</h1>
            <button type="button" class="btn rounded-lg preset-filled-primary-50-950 text-wrap" onclick={deleteStitches}>Delete Stitches</button>
         </div>
            
            <div class="m-2" transition:fade={{duration:600}}>
               <label for="selectAll" class="label-text">
                  Select All
                  <input type="checkbox" name="selectAll" id="selectAll" class="checkbox" onchange={toggleAll} checked={selectedStitches.length === stitches.length}>
               </label>
               <Accordion value={accordionValue} onValueChange={(event) => (accordionValue = event.value)} onFocusChange={()=>selectedStitches=[]} collapsible={true}>
                     {#each rows as row}
                     {@const rowStitches = stitches.filter((stitch) => stitch.rowId === row.rowId)}
                        <Accordion.Item value={row.rowId}>
                           {#snippet control()}
                              Row number {row.number.toString()}, {rowStitches.length} stitches
                              {#if allStitchesCompleted(rowStitches)}
                                 Row Completed!
                              {/if}
                           {/snippet}
                           {#snippet panel()}
                              <div>
                                 <label for={row.rowId} class="label-text">Select All
                                    <input type="checkbox" name={row.rowId} id={row.rowId} class="checkbox" value={row.rowId} onclick={(e)=>toggleRow(e, row.rowId)}>
                                 </label>
                                 <button class="btn rounded-lg preset-filled-primary-50-950 text-wrap" onclick={()=>completeFullRow(row.rowId)}>Complete Whole Row</button>
                              </div>
                              {#each rowStitches as stitch}
                                 <div class="grid grid-cols-5 gap- x-1 align-middle">
                                    <input type="checkbox" class='checkbox' name={stitch.id} id={stitch.id} bind:group={selectedStitches} value={stitch.id}>
                                    <div>{stitch.number}</div>
                                    <div>{stitch.type}</div>
                                    <div><button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit sm:w-full" onclick={()=>toggleStitch(stitch.id, !stitch.completed)}>
                                       {#if stitch.completed}
                                          Undo Stitch
                                       {:else}
                                          Complete Stitch
                                       {/if}
                                    </button></div>
                                    <div><button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit sm:w-full" onclick={()=>startSewingMode(stitch.id)}>Start Sewing mode here</button></div>
                                 </div>
                              {/each}
                              <NewPatternForm data={data.newPatternForm}  rowId={row.rowId} />
                              <button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit sm:w-full" onclick={()=>deleteRow(row.rowId)}>Delete Row (all stitches must be deleted first)</button>
                           {/snippet}
                        </Accordion.Item>
                     {/each}
               </Accordion>
               <NewRowForm projectId={project.id} data={data.newRowForm} rowNumber={rows.length+1}/>
               <ProjectDeleteForm projectId={project.id} projectName={project.name} data={data.projectDeleteForm}/>
            </div>
            {/if}
         {/if}
      {/await}
   {/await}   
{/await}