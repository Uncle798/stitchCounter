import { superValidate, message, fail } from 'sveltekit-superforms';
import { ratelimit } from '$lib/server/rateLimit';
import type { PageServerLoad, Actions, } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { projectDeleteFormSchema } from '$lib/formSchemas/schemas';
import { date } from 'zod';

export const load = (async (event) => {
   return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event) => {
      // if(!event.locals.user){
      //    redirect(302, '/login?toast=unauthorized')
      // }
      const formData = await event.request.formData();
      const projectDeleteForm = await superValidate(formData, zod(projectDeleteFormSchema));
      const { success, reset } = await ratelimit.general.limit(event.getClientAddress())
      if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
         return message(projectDeleteForm, `Please wait ${timeRemaining}s before trying again.`)
      }
      console.log(projectDeleteForm)
      if(!projectDeleteForm.valid){
         return message(projectDeleteForm, 'Unable to process invalid form');
      }
      const project = await prisma.project.findUnique({
         where: {
            id: projectDeleteForm.data.projectId
         }
      })
      if(!project){
         fail(404, projectDeleteForm)
      }
      // if(project?.ownerId !== event.locals.user.id){
      //    message(projectDeleteForm, 'Not your project to delete');
      // }
      console.log(project?.name.localeCompare(projectDeleteForm.data.projectName))
      if(project?.name.localeCompare(projectDeleteForm.data.projectName) === 0){
         await prisma.stitch.deleteMany({
            where: {
               row: {
                  projectId: project?.id
               }
            }
         })
         await prisma.row.deleteMany({
            where: {
               projectId: project?.id
            }
         })
         await prisma.project.delete({
            where: {
               id: project?.id
            }
         })
         message(projectDeleteForm, 'Project deleted')
      }
      message(projectDeleteForm, 'Please type name exactly to delete')
   }
};