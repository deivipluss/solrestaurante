import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dasjnlinj",
  api_key: "658875611319175",
  api_secret: "Qv9_rVT1TGXUIRIBskSJB6-5ye8",
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const customerName = formData.get("name") as string
    const customerPhone = formData.get("phone") as string
    const totalAmount = Number.parseFloat(formData.get("total") as string)
    const receipt = formData.get("receipt") as File
    const items = JSON.parse(formData.get("items") as string)

    if (!customerName || !customerPhone || !totalAmount || !receipt || !items) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Upload receipt to Cloudinary
    let cloudinaryUrl = ""
    try {
      const buffer = await receipt.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      const dataURI = `data:${receipt.type};base64,${base64}`

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "restaurant-receipts",
      })
      cloudinaryUrl = uploadResult.secure_url
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error)
      return NextResponse.json({ error: "Error al procesar la imagen del recibo" }, { status: 500 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Insert order
      const orderResult = await client.query(
        "INSERT INTO orders (customer_name, customer_phone, total_amount) VALUES ($1, $2, $3) RETURNING id",
        [customerName, customerPhone, totalAmount],
      )
      const orderId = orderResult.rows[0].id

      // Insert payment proof
      await client.query("INSERT INTO payment_proofs (order_id, cloudinary_url) VALUES ($1, $2)", [
        orderId,
        cloudinaryUrl,
      ])

      // Insert order items
      for (const item of items) {
        await client.query("INSERT INTO order_items (order_id, item_name, quantity, price) VALUES ($1, $2, $3, $4)", [
          orderId,
          item.name,
          item.quantity,
          Number.parseFloat(item.price.replace("S/", "")),
        ])
      }

      await client.query("COMMIT")

      return NextResponse.json({ success: true, orderId: orderId, receiptUrl: cloudinaryUrl })
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Error al guardar la orden:", error)
      return NextResponse.json({ error: "Error al procesar la orden" }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error en el servidor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

