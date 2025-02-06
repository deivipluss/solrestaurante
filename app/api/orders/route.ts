import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const config = {
  api: {
    bodyParser: false,
  },
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

    // Verificar tamaño del archivo
    if (receipt.size > 4.5 * 1024 * 1024) {
      // 4.5MB en bytes
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande. El tamaño máximo permitido es 4.5MB" },
        { status: 413 },
      )
    }

    // Cloudinary upload
    let cloudinaryUrl
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
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

