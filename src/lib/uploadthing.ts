import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/upload/route";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
