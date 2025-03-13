import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { rowId, type, stitchNumber} = body;
   console.log('new stitch')
   const row = await prisma.row.findUnique({
      where: {
         rowId,
      }
   })
   if(row){
      const rowStitches = await prisma.stitch.count({
         where: {
            rowId: row.rowId
         }
      })
      console.log(rowStitches)
      const stitch = await prisma.stitch.create({
         data: {
            rowId:row.rowId,
            type,
            number: stitchNumber
         }
      })
      return new Response(JSON.stringify(stitch), {status: 200})
   }
   return new Response(null, {status:200})
}

export const DELETE: RequestHandler = async (event) => {
   const body = await event.request.json()
   const { stitchId } = body
   const stitch = await prisma.stitch.findUnique({
      where: {
         id: stitchId
      },

      // include: {
      //    row: {
      //       include: {
      //          project: {
      //             select: {
      //                ownerId: true
      //             }
      //          }
      //       }
      //    }
      // }
   })
   if(!stitch){
      return new Response(JSON.stringify('Stitch not found'), {status: 404})
   }
   // if(stitch.row.project.ownerId !== event.locals.user?.id){
   //    return new Response(JSON.stringify('Not your stitch'), { status: 402})
   // }
   await prisma.stitch.delete({
      where: {
         id: stitch.id
      }
   })
   return new Response(JSON.stringify('Stitch deleted'), { status: 200 });
};

export const PATCH: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { stitchId } = body;
   const stitch = await prisma.stitch.findUnique({
      where: {
         id: stitchId
      },
      // include: {
      //    row: {
      //       include: {
      //          project: {
      //             select: {
      //                ownerId: true
      //             }
      //          }
      //       }
      //    }
      // }
   })
   if(!stitch){
      return new Response(JSON.stringify('Stitch not found'), {status: 404});
   }

   const updatedStitch = await prisma.stitch.update({
      where: {
         id: stitch.id
      },
      data: {
         completed:!stitch.completed
      }
   })
   return new Response(JSON.stringify(updatedStitch), {status: 200});
}