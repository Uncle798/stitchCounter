import { prisma } from '$lib/server/prisma';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newPatternSchema, newRowFormSchema, projectDeleteFormSchema } from '$lib/formSchemas/schemas';


export const load = (async (event) => {
   const project = await prisma.project.findUnique({
      where: {
         id: event.params.projectId
      }
   });
   const rows = await prisma.row.findMany({
      where: {
         projectId: project?.id
      },
      include: {
         stitches: true
      }
   })
   const newRowForm = await superValidate(zod(newRowFormSchema));
   const newPatternForm = await superValidate(zod(newPatternSchema));
   const projectDeleteForm = await superValidate(zod(projectDeleteFormSchema))
   return { project, rows, newRowForm, newPatternForm, projectDeleteForm };
}) satisfies PageServerLoad;