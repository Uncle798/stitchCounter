<script lang="ts">
   import type { CuidIdFormSchema } from "$lib/formSchemas/schemas";
   import type { Infer, SuperValidated } from "sveltekit-superforms";
   import { superForm } from "sveltekit-superforms";

   interface Props {
      data: SuperValidated<Infer<CuidIdFormSchema>>;
      stitchId: string;
      classes?: string;
   }
   let { data, stitchId, classes='' }:Props = $props()
   let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
         
      },
      warnings: {
         duplicateId: false
      }
   });
</script>

<div class={classes}>
   
</div>