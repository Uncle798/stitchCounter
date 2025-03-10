<script lang="ts">
   import FormMessage from "$lib/formComponents/FormMessage.svelte";
   import FormSubmitWithProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
   import type { NewRowFormSchema } from "$lib/formSchemas/schemas";
   import type { Infer, SuperValidated } from "sveltekit-superforms";
   import { superForm } from "sveltekit-superforms";

   interface Props {
      data: SuperValidated<Infer<NewRowFormSchema>>;
      projectId: string
      rowNumber: number
      newRowModalOpen?: boolean;
      classes?: string; 
   }
   let { data, projectId, rowNumber, newRowModalOpen=$bindable(false), classes='' }:Props = $props()
   let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
         newRowModalOpen=false
      }
   });
</script>
<div class={classes}>
   <FormMessage message={$message} />
   <form action="/forms/newRowForm" method="POST" use:enhance>
      <input type="hidden" name="rowNumber" value={rowNumber} />
      <input type="hidden" name="projectId" value={projectId} />
      <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText="Add row"/>
   </form>
</div>