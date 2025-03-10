<script lang="ts">
   import TextInput from '$lib/formComponents/TextInput.svelte';
   import type { Infer, SuperValidated } from 'sveltekit-superforms';
   import type { NewProjectFormSchema } from '$lib/formSchemas/schemas';
   import { superForm } from 'sveltekit-superforms'
   import FormMessage from '$lib/formComponents/FormMessage.svelte';
    import FormSubmitWithProgress from '$lib/formComponents/FormSubmitWithProgress.svelte';
   interface Props {
      data: SuperValidated<Infer<NewProjectFormSchema>>;
      newProjectModalOpen?: boolean;
      classes?: string; 
   }
   let {
      data,
      newProjectModalOpen=$bindable(false),
      classes=''
   }:Props = $props()
   let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
         newProjectModalOpen=false
      }
   });
</script>
<div class={classes}>
   <FormMessage message={$message} />
   <form action="/forms/newProjectForm" method="POST" use:enhance>
      <TextInput
      bind:value={$form.name}
      errors={$errors.name}
      constraints={$constraints.name}
      label='Project Name'
      name='name'
      placeholder='Red scarf'
   />
   <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText='Start New Project'/>
   </form>
</div>