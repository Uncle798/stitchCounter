import { superValidate, message } from 'sveltekit-superforms';
import { ratelimit } from '$lib/server/rateLimit';
import type { PageServerLoad, Actions, } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { newRowFormSchema } from '$lib/formSchemas/schemas';

export const load = (async (event) => {
   return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event) => {
      // if(!event.locals.user){
      //    redirect(302, '/login?toast=unauthorized')
      // }
      const formData = await event.request.formData();
      const newRowForm = await superValidate(formData, zod(newRowFormSchema));
      //for minimal repo
      const { success, reset } = await ratelimit.general.limit(event.getClientAddress())
      if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
         return message(newRowForm, `Please wait ${timeRemaining}s before trying again.`)
      }
      console.log(newRowForm)
      if(!newRowForm.valid){
         return message(newRowForm, 'Unable to process invalid form');
      }
      const row = await prisma.row.create({
         data: {
            projectId: newRowForm.data.projectId,
            number: newRowForm.data.rowNumber
         }
      })
      message(newRowForm, 'row created')
   }
};