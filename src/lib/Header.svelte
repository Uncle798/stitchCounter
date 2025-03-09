<script lang="ts">
   interface Props {
      title: string
   }
   let { title }:Props = $props();
   
</script>
<svelte:head>
	<title>Stich Counter | {title}</title>
</svelte:head>
