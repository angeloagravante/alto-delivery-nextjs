import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

const uploadRouter = {
  storeLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
}); 
