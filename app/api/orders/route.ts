import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  let client

  try {
    const formData = await request.formData()
    const receipt = formData.get("receipt") as File
    const items = JSON.parse(formData.get("items") as string)
    
    if (!receipt) {
      return NextResponse.json({ success: false, error: "Comprobante requerido" }, { status: 400 })
    }

    // Verificar tamaño
    const MAX_SIZE = 4.5 * 1024 * 1024
    if (receipt.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande. Máximo 4.5MB" },
        { status: 413 }
      )
    }

    // Procesar archivo
    const arrayBuffer = await receipt.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Cloudinary
    let cloudinaryUrl
    try {
      cloudinaryUrl = await uploadToCloudinary(buffer, receipt.type)
      console.log("URL de Cloudinary:", cloudinaryUrl)
    } catch (error) {
      console.error("Error de Cloudinary:", error)
      return NextResponse.json(
        { success: false, error: "Error al subir imagen" },
        { status: 500 }
      )
    }

    // Iniciar transacción DB
    client = await pool.connect()
    await client.query('BEGIN')

    try {
      // 1. Insertar orden principal
      const orderResult = await client.query(
        `INSERT INTO orders (customer_name, customer_phone, total_amount) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
        [
          formData.get("customerName"),
          formData.get("customerPhone"),
          formData.get("totalAmount")
        ]
      )
      const orderId = orderResult.rows[0].id

      // 2. Insertar comprobante de pago
      await client.query(
        `INSERT INTO payment_proofs (order_id, cloudinary_url) 
         VALUES ($1, $2)`,
        [orderId, cloudinaryUrl]
      )

      // 3. Insertar items del pedido
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, item_name, quantity, price) 
           VALUES ($1, $2, $3, $4)`,
          [
            orderId,
            item.name,
            item.quantity,
            parseFloat(item.price.replace("S/", ""))
          ]
        )
      }

      await client.query('COMMIT')

      return NextResponse.json({ 
        success: true, 
        orderId: orderId,
        receiptUrl: cloudinaryUrl 
      })

    } catch (error) {
      await client.query('ROLLBACK')
      console.error("Error en transacción:", error)
      return NextResponse.json(
        { success: false, error: "Error en base de datos" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error general:", error)
    return NextResponse.json(
      { success: false, error: "Error al procesar la orden" },
      { status: 500 }
    )
  } finally {
    if (client) client.release()
  }
}