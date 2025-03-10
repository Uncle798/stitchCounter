<script lang="ts">
    import EmailInput from "$lib/formComponents/EmailInput.svelte";
    import FormSubmitWithProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
    import FormMessage from "$lib/formComponents/FormMessage.svelte";
    import { superForm } from "sveltekit-superforms";
    import type { LoginSchema } from "$lib/formSchemas/schemas";
    import type { SuperValidated, Infer } from "sveltekit-superforms";
    interface Props {
        data: SuperValidated<Infer<LoginSchema>>;
        classes?: string
    }
    let { data, classes='' }:Props = $props()
    let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
      }
   });
</script>
<div class={classes}>
    <p class="h2 ">Please enter your email to login </p>
    <div class="h4">
        <FormMessage message={$message} />
    </div>
    <form method="post" use:enhance >
        <EmailInput
        bind:value={$form.email}
        errors={$errors.email}
        constraints={$constraints.email}
        label='Registered email address: '
        name='email'
        />
        <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText='Email me a link to login'/>
    </form>
    <div class="flex flex-col">
        <a href="/login/google" class="anchor">Sign in with Google</a>
        <a href="/login/yahoo" class="anchor">Sign in with Yahoo!</a>
        <a href="/register" class="anchor">Register new account</a>
    </div>
</div>
