<script lang="ts">
   import type { Stitch } from "@prisma/client";
   interface Props {
      stitch: Stitch;
      classes?: string 
   }
   let { stitch, classes='' }:Props = $props()
</script>

<div class={classes}>
   Number: {stitch.number}
   Type: {stitch.type}
</div>