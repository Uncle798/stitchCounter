<script lang="ts">
   import { Combobox } from "@skeletonlabs/skeleton-svelte"
   import type { Project } from "@prisma/client";
   import type { PageData } from "./$types";
   import NewProjectForm from "$lib/forms/NewProjectForm.svelte";
   import { goto } from "$app/navigation";

   interface Props {
      data: PageData
   }
   let {
      data
   }:Props = $props()
   interface ComboboxData {
      label: string;
      value: string;
   }
   let projectSelect = $state([''])
   let projectComboBoxData:ComboboxData[] = [];

   const wrapper = new Promise<Project[]>(async res => {
      const projects = await data.projects
      projects.forEach((project) => {
         const datum:ComboboxData = {
            label: project.name,
            value: project.id
         }
         projectComboBoxData.push(datum)
      })
      res(projects)
   })
</script>
{#if data.user}
   

{#await wrapper}
   <div>Loading projects</div>
{:then projects} 
   <div class="m-2">
      <Combobox
         data={projectComboBoxData}
         value={projectSelect}
         label='Projects'
         placeholder='Select...'
         openOnClick={true}
         onValueChange={(details) => {
            goto(`/projects/${details.value[0]}`)
         }}
      />
      <NewProjectForm data={data.newProjectForm} />
   </div>
   {/await}
{:else}
   <
{/if}