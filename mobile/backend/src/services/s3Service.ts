/* src/services/s3Service.ts */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { AWS_REGION, AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../config/awsConfig";

const s3Client = new S3Client({
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

export const subirArchivoAS3 = async (filePath: string, fileName: string, contentType: string): Promise<string> => {
  const fileStream = fs.createReadStream(filePath);
  const uniqueFileName = `uploads/${Date.now()}-${uuidv4()}-${fileName}`;
  const params = {
    Bucket: AWS_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: fileStream,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`;
};
