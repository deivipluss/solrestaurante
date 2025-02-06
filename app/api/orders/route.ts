import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  console.log("Recibida solicitud POST en /api/orders")
  let client

  try {
    const formData = await request.formData()

    // Validación y procesamiento de datos...
    const receipt = formData.get("receipt") as File
    if (!receipt) {
      return NextResponse.json({ success: false, error: "Comprobante requerido" }, { status: 400 })
    }

    // Cloudinary
    let cloudinaryUrl
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
      console.log("Cloudinary URL:", cloudinaryUrl)
    } catch (error) {
      console.error("Error Cloudinary:", error)
      return NextResponse.json({ success: false, error: "Error al subir comprobante" }, { status: 500 })
    }

    // Base de datos
    client = await pool.connect()
    await client.query("BEGIN")

    try {
      // Operaciones de base de datos...
      const orderId = 1 // Reemplazar con la lógica real para obtener el orderId
      await client.query("INSERT INTO orders (receipt_url) VALUES ($1)", [cloudinaryUrl])

      await client.query("COMMIT")
      return NextResponse.json({ success: true, orderId, receiptUrl: cloudinaryUrl })
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
      console.log("Conexión liberada")
    }
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Length": "0",
    },
  })
}

