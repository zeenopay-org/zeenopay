import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_REGION;
const ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
const SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY;

console.log("🔍 AWS Config:", {
  S3_BUCKET,
  REGION,
  ACCESS_KEY: ACCESS_KEY ? "✅ Loaded" : "❌ Missing",
  SECRET_KEY: SECRET_KEY ? "✅ Loaded" : "❌ Missing",
});

// ✅ Initialize S3 Client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export const uploadToS3 = async (file, onProgress, onSuccess, onError) => {
  if (!file) {
    console.error("❌ No file selected for upload.");
    return;
  }

  console.log("📂 Uploading File:", file.name);

  try {
    // Convert file to a Blob (Buffer) before uploading
    const fileBuffer = await file.arrayBuffer();

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: fileBuffer, // ✅ Fix: Use ArrayBuffer instead of raw file
      ContentType: file.type, // Helps S3 identify file type
    };

    console.log("🚀 Sending upload request to AWS S3...", params);

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log("✅ Upload Success:", response);

    const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`;
    console.log("✅ File URL:", fileUrl);

    onSuccess(fileUrl);
  } catch (error) {
    console.error("❌ AWS Upload Error:", error);
    onError(error);
  }
};
