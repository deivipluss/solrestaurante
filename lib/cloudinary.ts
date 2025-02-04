import { v2 as cloudinary } from "cloudinary"

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Cloudinary environment variables are missing")
  throw new Error("Cloudinary configuration is incomplete")
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export const uploadToCloudinary = async (file: Buffer, fileType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "restaurant-receipts",
          allowed_formats: ["jpg", "png", "jpeg", "gif"],
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            resolve(result?.secure_url || "")
          }
        },
      )
      .end(file)
  })
}

export { cloudinary }

