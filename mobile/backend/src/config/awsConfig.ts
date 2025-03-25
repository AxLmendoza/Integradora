/* awsConfig.ts */

import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

export const AWS_REGION: string | undefined = process.env.AWS_REGION;
export const AWS_BUCKET_NAME: string | undefined = process.env.AWS_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_REGION || !AWS_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.warn("⚠️ Advertencia: Algunas variables de entorno de AWS no están definidas.");
}