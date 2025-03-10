<script lang="ts">
   import FormMessage from "$lib/formComponents/FormMessage.svelte";
    import FormSubmitWithProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
   import TextInput from "$lib/formComponents/TextInput.svelte";
   import type { ProjectDeleteFormSchema } from "$lib/formSchemas/schemas";
   import type { Infer, SuperValidated } from "sveltekit-superforms";
   import { superForm  } from "sveltekit-superforms";

   interface Props {
      data: SuperValidated<Infer<ProjectDeleteFormSchema>>;
      projectId: string
      projectName: string
      classes?: string
   }
   let { data, projectId, projectName, classes=''}:Props = $props()
   let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
      }
   });
</script>
<div class={classes}>
   <form action="/forms/projectDeleteForm" method="POST" use:enhance>
      <FormMessage message={$message} />
      <TextInput
         bind:value={$form.projectName}
         errors={$errors.projectName}
         constraints={$constraints.projectName}
         name='projectName'
         label="Please type {projectName} to delete {projectName}"
         placeholder='This is permanent '
      />
      <input type="hidden" name="projectId" value={projectId}>
      <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText='Permanently Delete this project' />
   </form>
</div>