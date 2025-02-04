import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

