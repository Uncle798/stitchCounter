import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    const body = await event.request.json();
    const { rowId } = body;
    if(rowId){
        const row = await prisma.row.findUnique({
            where: {
                rowId
            }
        })
        if(row){
            return new Response(JSON.stringify(row), {status: 200})
        }
        return new Response(JSON.stringify('Row not found'), {status: 404})
    }
    return new Response(JSON.stringify('Row Id not provided'), {status: 400});
};

export const DELETE: RequestHandler = async (event) => {
    const body = await event.request.json();
    const { rowId } = body;
    if(rowId){
        const row = await prisma.row.findUnique({
            where: {
                rowId
            }
        })
        if(row){
            const stitchCount = await prisma.stitch.count({
                where: {
                    rowId: row.rowId
                }
            })
            if(stitchCount === 0){
                await prisma.row.delete({
                    where: {
                        rowId: row.rowId
                    }
                })
                return new Response(JSON.stringify('Row deleted'), {status: 200})
            }
            return new Response(JSON.stringify('Please delete stitches first'), {status: 400})
        }
        return new Response(JSON.stringify('Row not found'), {status: 404})
    }
    return new Response(JSON.stringify('Row Id not provided'), {status: 400})
};

export const POST: RequestHandler = async (event) => {
    const body = await event.request.json();
    const { projectId } = body
    if(projectId){
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });
        if(project){
            const rowCount = await prisma.row.count({
                where: {
                    projectId: project.id
                }
            })
            const row = await prisma.row.create({
                data:{
                    projectId: project.id,
                    number: rowCount + 1,
                }
            })
        }
        return new Response(JSON.stringify('Project not found'), {status: 404})
    }
    return new Response(JSON.stringify('Project Id not provided'), {status: 400})
}
