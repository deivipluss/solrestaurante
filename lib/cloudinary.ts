import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary/types';

// Verificar variables de entorno
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Faltan variables de entorno de Cloudinary");
}

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: Buffer, fileType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "restaurant-receipts",
        allowed_formats: ["jpg", "png", "jpeg", "gif"],
        resource_type: "auto",
        transformation: [
          { width: 1920, height: 1080, crop: "limit" }, 
          { quality: "auto:good" }
        ],
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error("Error de Cloudinary:", error);
          reject(new Error(`Error al subir a Cloudinary: ${error.message}`));
        } else if (!result?.secure_url) {
          reject(new Error("Error al subir a Cloudinary: No se recibió URL segura"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file);
  });
};