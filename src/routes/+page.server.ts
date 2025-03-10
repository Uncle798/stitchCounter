import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newProjectFormSchema } from '$lib/formSchemas/schemas';

export const load = (async () => {
    const projects = prisma.project.findMany();
    const newProjectForm = await superValidate(zod(newProjectFormSchema));
    return { projects, newProjectForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    newProject: async(event) => {
        if(!event.locals.user){
            redirect(302,'/login')
        }
    }
};