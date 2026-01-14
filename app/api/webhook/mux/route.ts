import mux from '@/lib/mux';
import { prisma } from '@/lib/prisma';
import { UTApi } from 'uploadthing/server';

const muxSigningSecret = process.env.MUX_SECRET;

export const POST = async (req: Request) => {
  try {
    const expectedSignature = req.headers.get('mux-signature') as string;

    if (!expectedSignature) {
      return new Response('Missing MUX signature', { status: 400 });
    }

    const body = await req.text();

    mux.webhooks.verifySignature(body, req.headers, muxSigningSecret);

    const event = JSON.parse(body);

    if (event.type === 'video.asset.ready') {
      await prisma.$transaction(async (tx) => {
        const muxData = await tx.muxData.findFirst({
          where: {
            muxAssetId: event.data.id,
          },
          include: {
            lesson: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!muxData) {
          throw new Error('Mux data not found');
        }

        await tx.lesson.update({
          where: {
            id: muxData.lesson.id,
          },
          data: {
            status: 'ready',
          },
        });
        const utapi = new UTApi();
        await utapi.deleteFiles([muxData.uploadthingFileId]);
      });
    }
    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
};
