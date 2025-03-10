<script lang="ts">
    import EmailInput from '$lib/formComponents/EmailInput.svelte';
    import { getContext, onMount } from 'svelte';
    import FormSubmitWithProgress from '$lib/formComponents/FormSubmitWithProgress.svelte';
    import type { ToastContext, } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	import FormMessage from '$lib/formComponents/FormMessage.svelte';
	import Header from '$lib/Header.svelte';
	import { fade } from 'svelte/transition';
    import LoginForm from '$lib/forms/LoginForm.svelte';
    
    export let data: PageData;
    let { form, message, errors, constraints, enhance, delayed, timeout } = superForm(data.magicLinkForm);
    export const toast:ToastContext = getContext('toast');
    const toastReason = data.toastReason;
    onMount(() => {
        if(toastReason === 'userAlreadyExists'){
            toast.create({
                title: 'Email already in use',
                description: 'That email has been used already please login',
                type: 'info'
            })
        }
        if(toastReason === 'unauthorized'){
            toast.create({
                title: 'You must be logged in to access that page',
                description: 'To access that page please log in',
                type: 'error'
            })
        }
        if(toastReason === 'admin'){
            toast.create({
                title: 'Unauthorized',
                description: 'To access that page you must be an Administrator',
                type: 'error'
            })
        }
        if(toastReason === 'employee'){
            toast.create({
                title: 'Unauthorized',
                description: 'To access that page you must be an employee',
                type: 'error'
            })
        }
        if(toastReason === 'linkExpired'){
            toast.create({
                title: 'The link has expired',
                description: 'Links are only valid for 5 minutes, please enter your email address again',
                type: 'error'
            })

        }
    })
</script>
<Header title="Login" />
<LoginForm data={data.magicLinkForm} />