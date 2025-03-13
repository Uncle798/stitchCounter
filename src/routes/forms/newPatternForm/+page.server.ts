import { superValidate, message } from 'sveltekit-superforms';
import { ratelimit } from '$lib/server/rateLimit';
import type { PageServerLoad, Actions, } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { newPatternSchema } from '$lib/formSchemas/schemas';

export const load = (async (event) => {
   return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event) => {
      // if(!event.locals.user){
      //    redirect(302, '/login?toast=unauthorized')
      // }
      const formData = await event.request.formData();
      const newPatternForm = await superValidate(formData, zod(newPatternSchema));
      const { success, reset } = await ratelimit.general.limit(event.getClientAddress())
      if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
         return message(newPatternForm, `Please wait ${timeRemaining}s before trying again.`)
      }
      if(!newPatternForm.valid){
         return message(newPatternForm, 'Unable to process invalid form');
      }
      const numberOfStitchesInRow = await prisma.stitch.count({
         where: {
            rowId: newPatternForm.data.rowId
         }
      })
      const numberOfStitches = numberOfStitchesInRow + newPatternForm.data.numberOfStitches
      for(let i=numberOfStitchesInRow; i<numberOfStitches; i++){
         const stitch = await prisma.stitch.create({
            data: {
               rowId: newPatternForm.data.rowId,
               type: newPatternForm.data.typeOfStitches,
               number: i+1,
            }
         })
      }
   }
};