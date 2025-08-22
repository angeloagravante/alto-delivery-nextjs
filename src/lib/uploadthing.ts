import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// UploadThing client configuration
export const uploadThingConfig = {
  url: process.env.NEXT_PUBLIC_UPLOADTHING_URL || "https://uploadthing.com",
};
