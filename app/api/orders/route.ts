import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

// Headers CORS para todas las respuestas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function POST(request: NextRequest) {
  console.log("Recibida solicitud POST en /api/orders")
  let client
  try {
    const formData = await request.formData()
    
    // Validación mejorada de campos
    const customerName = formData.get("customerName")?.toString()
    const customerPhone = formData.get("customerPhone")?.toString()
    const totalAmount = Number(formData.get("totalAmount")?.toString() || "")
    const receipt = formData.get("receipt") as File | null
    const itemsRaw = formData.get("items")?.toString()

    console.log("Datos recibidos:", { customerName, customerPhone, totalAmount })

    // Validación estricta
    if (!customerName?.trim() || !customerPhone?.trim() || isNaN(totalAmount) || !receipt || !itemsRaw) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos o son inválidos" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validación de items
    let items
    try {
      items = JSON.parse(itemsRaw)
      if (!Array.isArray(items)) throw new Error("Formato inválido para items")
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Formato inválido para items del pedido" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Subida a Cloudinary
    let cloudinaryUrl
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
      console.log("Cloudinary URL:", cloudinaryUrl)
    } catch (error) {
      console.error("Error Cloudinary:", error)
      return NextResponse.json(
        { success: false, error: "Error al subir el comprobante" },
        { status: 500, headers: corsHeaders }
      )
    }

    client = await pool.connect()
    await client.query("BEGIN")

    // Insertar orden
    const orderRes = await client.query(
      `INSERT INTO orders (customer_name, customer_phone, total_amount)
       VALUES ($1, $2, $3) RETURNING id`,
      [customerName.trim(), customerPhone.trim(), totalAmount]
    )
    const orderId = orderRes.rows[0]?.id
    if (!orderId) throw new Error("No se obtuvo ID de orden")

    // Insertar comprobante
    await client.query(
      `INSERT INTO payment_proofs (order_id, cloudinary_url)
       VALUES ($1, $2)`,
      [orderId, cloudinaryUrl]
    )

    // Insertar items
    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) {
        throw new Error("Item incompleto")
      }
      await client.query(
        `INSERT INTO order_items (order_id, item_name, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.name, Number(item.quantity), Number(String(item.price).replace("S/", ""))]
      )
    }

    await client.query("COMMIT")

    return NextResponse.json(
      { success: true, orderId, receiptUrl: cloudinaryUrl },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error("Error general:", error)
    if (client) {
      try {
        await client.query("ROLLBACK")
      } catch (rollbackError) {
        console.error("Error en ROLLBACK:", rollbackError)
      }
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    if (client) client.release()
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}