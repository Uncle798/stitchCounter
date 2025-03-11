import { superValidate, message } from 'sveltekit-superforms';
import { ratelimit } from '$lib/server/rateLimit';
import type { PageServerLoad, Actions, } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newProjectFormSchema } from '$lib/formSchemas/schemas';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';


export const load = (async () => {
   const newProjectForm = await superValidate(zod(newProjectFormSchema))
   return {newProjectForm};
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event) => {
      // if(!event.locals.user){
      //    redirect(302, '/login?toast=unauthorized')
      // }
      const formData = await event.request.formData();
      const newProjectForm = await superValidate(formData, zod(newProjectFormSchema));
      // should be event.locals.user.id
      const { success, reset } = await ratelimit.general.limit(event.getClientAddress())
      if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
         return message(newProjectForm, `Please wait ${timeRemaining}s before trying again.`)
      }
      if(!newProjectForm.valid){
         return message(newProjectForm, 'Unable to process invalid form');
      }
      const project = await prisma.project.create({
         data:{
            // ownerId: event.locals.user.id,
            name: newProjectForm.data.name
         }
      })
      redirect(302, `/projects/${project.id}`)
   }
};