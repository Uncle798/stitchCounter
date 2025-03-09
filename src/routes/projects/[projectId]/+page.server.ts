import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
   const project = await prisma.project.findUnique({
      where: {
         id: event.params.projectId
      }
   });
   const rows = await prisma.row.findMany({
      where: {
         projectId: project?.id
      }
   })
   return { project, rows };
}) satisfies PageServerLoad;