<script lang="ts">
   import FormMessage from "$lib/formComponents/FormMessage.svelte";
   import TextInput from "$lib/formComponents/TextInput.svelte";
   import EmailInput from "$lib/formComponents/EmailInput.svelte";
   import FormSubmitWithProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
   import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import type { RegisterFormSchema } from "$lib/formSchemas/schemas";
   
   interface Props {
      data: SuperValidated<Infer<RegisterFormSchema>>
      registerFormModalOpen?: boolean
      classes?: string;
   }
   let { data, registerFormModalOpen = $bindable(), classes="" }:Props = $props();
   let { form, errors, constraints, message, enhance, delayed, timeout} = superForm(data, {
      onUpdated(){
         registerFormModalOpen=false;
      }
   })
</script>
<div class={classes}>
   <FormMessage message={$message} />
   <form method="POST" action="/forms/registerForm" use:enhance>
      <TextInput
         label='Given name'
         name='givenName'
         bind:value={$form.givenName}
         errors={$errors.givenName}
         constraints={$constraints.givenName}
         placeholder='Smokey'
      />
      <TextInput
         label='Family name'
         name='familyName'
         bind:value={$form.familyName}
         errors={$errors.familyName}
         constraints={$constraints.familyName}
         placeholder='Bear'
      />
      <EmailInput
         label="Email"
         name="email"
         bind:value={$form.email}
         errors={$errors.email}
         constraints={$constraints.email}
         placeholder='smokeybear@theforest.email'
      />
      <EmailInput
         label="Confirm email"
         name="emailConfirm"
         bind:value={$form.emailConfirm}
         errors={$errors.emailConfirm}
         constraints={$constraints.emailConfirm}
         placeholder='smokeybear@theforest.email'
      />
      <FormSubmitWithProgress delayed={$delayed} timeout={$timeout}/>
   </form>
</div>