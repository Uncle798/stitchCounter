import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const projects = prisma.project.findMany()
    return { projects };
}) satisfies PageServerLoad;