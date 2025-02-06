import { v2 as cloudinary } from "cloudinary"

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary environment variables are missing")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: Buffer, fileType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "restaurant-receipts",
        allowed_formats: ["jpg", "png", "jpeg", "gif"],
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error)
          reject(new Error(`Cloudinary upload failed: ${error.message}`))
        } else if (!result?.secure_url) {
          reject(new Error("Cloudinary upload failed: No secure URL returned"))
        } else {
          resolve(result.secure_url)
        }
      },
    )

    uploadStream.end(file)
  })
}

export { cloudinary }

