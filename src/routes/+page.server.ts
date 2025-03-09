import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    const projects = prisma.project.findMany()
    return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
    newProject: async(event) => {
        if(!event.locals.user){
            redirect(302,'/login')
        }
    }
};