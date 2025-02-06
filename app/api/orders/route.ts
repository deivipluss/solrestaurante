import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"
import sharp from "sharp"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).resize(1920, 1080, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer()
}

export async function POST(request: Request) {
  console.log("Recibida solicitud POST en /api/orders")
  let client

  try {
    const formData = await request.formData()
    const receipt = formData.get("receipt") as File

    if (!receipt) {
      return NextResponse.json({ success: false, error: "Comprobante requerido" }, { status: 400 })
    }

    // Compress image
    const buffer = await receipt.arrayBuffer()
    const compressedImageBuffer = await compressImage(Buffer.from(buffer))

    // Check compressed file size
    if (compressedImageBuffer.length > 4.5 * 1024 * 1024) {
      // 4.5MB in bytes
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande. El tamaño máximo permitido es 4.5MB" },
        { status: 413 },
      )
    }

    // Cloudinary upload
    let cloudinaryUrl
    try {
      cloudinaryUrl = await uploadToCloudinary(compressedImageBuffer, "image/jpeg")
      console.log("Cloudinary URL:", cloudinaryUrl)
    } catch (error) {
      console.error("Error Cloudinary:", error)
      return NextResponse.json({ success: false, error: "Error al subir comprobante a Cloudinary" }, { status: 500 })
    }

    // Database operations
    client = await pool.connect()
    await client.query("BEGIN")

    try {
      const { rows } = await client.query(
        "INSERT INTO orders (receipt_url, customer_name, customer_phone, total_amount, items) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [
          cloudinaryUrl,
          formData.get("customerName"),
          formData.get("customerPhone"),
          formData.get("totalAmount"),
          formData.get("items"),
        ],
      )

      await client.query("COMMIT")
      return NextResponse.json({ success: true, orderId: rows[0].id, receiptUrl: cloudinaryUrl })
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Error en transacción:", error)
      return NextResponse.json({ success: false, error: "Error en transacción de base de datos" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error general:", error)
    return NextResponse.json({ success: false, error: "Error procesando solicitud" }, { status: 500 })
  } finally {
    if (client) {
      client.release()
    }
  }
}

