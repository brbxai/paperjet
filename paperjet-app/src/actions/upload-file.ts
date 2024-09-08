"use server";

import { ulid } from "ulid";
import { s3Client } from "../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { actionFailure, actionSuccess } from "@/lib/utils";

// Server action to upload a file (image) to Digital Ocean Spaces
export async function uploadFile(fileData: FormData) {
  const file = fileData.get("file") as File;
  if (!file) {
    return actionFailure("No file provided");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Remove non-alphanumeric characters from file name
    let fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "");

    // Generate a unique file name
    fileName = `${ulid()}-${fileName}`;

    // Use S3 client to upload the file to Digital Ocean Spaces
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ACL: "public-read" as "public-read",
    };
    const command = new PutObjectCommand(params);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_REGION}.cdn.digitaloceanspaces.com/${fileName}`;

    await s3Client.send(command);
    return actionSuccess({ url: fileUrl });
  } catch (error) {
    console.error(error);
    return actionFailure("Failed to upload file");
  }
}
