<script lang="ts">
   import FormSubmitWithProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
import NumberInput from "$lib/formComponents/NumberInput.svelte";
import type { NewPatternSchema } from "$lib/formSchemas/schemas";
   import type { Infer, SuperValidated } from "sveltekit-superforms";
   import { superForm } from "sveltekit-superforms";

   interface Props {
      data: SuperValidated<Infer<NewPatternSchema>>;
      rowId: string;
      newPatternModalOpen?: boolean;
      classes?: string
   }
   let { data, rowId, newPatternModalOpen=$bindable(false), classes=''}:Props = $props()

   let { form, errors, message, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdate(){
         newPatternModalOpen=false
      }
   });
</script>

<div class={classes}>
   <form action="/forms/newPatternForm" method="POST" use:enhance class="grid grid-cols-2 gap-1">
      <NumberInput
         bind:value={$form.numberOfStitches}
         errors={$errors.numberOfStitches}
         constraints={$constraints.numberOfStitches}
         name='numberOfStitches'
         label='Number of stitches'
         placeholder='3'
      />
      <label for="typeOfStitches" class="label-text">Type of stitches
         <select name="typeOfStitches" id="typeOfStitches" class="select" bind:value={$form.typeOfStitches}>
            {#each ['Single', 'Increase'] as stitch}
               <option value={stitch}>{stitch}</option>
            {/each}
         </select>
      </label>
      <input type="hidden" name="rowId" value={rowId}>
      <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText='Add stitches'/>
   </form>
</div>