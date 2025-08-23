import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

export const uploadRouter = {
  storeLogo: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1
    } 
  })
    .middleware(async () => {
      try {
        const { userId } = await auth();
        if (!userId) {
          console.error('Upload middleware - No userId found');
          throw new Error("Unauthorized - User not authenticated");
        }
        console.log('Upload middleware - userId:', userId);
        return { userId };
      } catch (error) {
        console.error('Upload middleware error:', error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log('Upload completed:', { file, metadata });
        return { uploadedBy: metadata.userId, url: file.ufsUrl || file.url };
      } catch (error) {
        console.error('Upload completion error:', error);
        throw error;
      }
    }),

  productImages: f({ 
    image: { 
      maxFileSize: "8MB", 
      maxFileCount: 10
    } 
  })
    .middleware(async () => {
      try {
        const { userId } = await auth();
        if (!userId) {
          console.error('Upload middleware - No userId found');
          throw new Error("Unauthorized - User not authenticated");
        }
        console.log('Upload middleware - userId:', userId);
        return { userId };
      } catch (error) {
        console.error('Upload middleware error:', error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log('Upload completed:', { file, metadata });
        return { uploadedBy: metadata.userId, url: file.ufsUrl || file.url };
      } catch (error) {
        console.error('Upload completion error:', error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
