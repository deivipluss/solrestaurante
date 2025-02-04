import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Timeouts configurados para Neon.tech
const DB_QUERY_TIMEOUT = 5000 // 5 segundos

export async function POST(request: NextRequest) {
  console.log("Recibida solicitud POST en /api/orders")
  let client
  try {
    const formData = await request.formData()
    
    // Validación mejorada
    const customerName = formData.get("customerName")?.toString()?.trim()
    const customerPhone = formData.get("customerPhone")?.toString()?.replace(/\D/g, '') // Solo números
    const totalAmount = Number(formData.get("totalAmount")?.toString()?.replace(/[^0-9.]/g, ''))
    const receipt = formData.get("receipt") as File | null
    const itemsRaw = formData.get("items")?.toString()

    // Validación estricta
    if (!customerName || !customerPhone || customerPhone.length < 8 || 
        isNaN(totalAmount) || totalAmount <= 0 || !receipt || !itemsRaw) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos o incompletos" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Procesar items
    let items
    try {
      items = JSON.parse(itemsRaw)
      if (!Array.isArray(items) || items.some(item => 
        !item?.name?.trim() || 
        isNaN(item?.quantity) || 
        isNaN(Number(String(item?.price).replace(/[^0-9.]/g, '')))
      )) {
        throw new Error("Estructura de items inválida")
      }
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Formato de items incorrecto" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Subir a Cloudinary
    let cloudinaryUrl
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
      console.log("Cloudinary URL:", cloudinaryUrl)
    } catch (error) {
      console.error("Error Cloudinary:", error)
      return NextResponse.json(
        { success: false, error: "Error al subir comprobante" },
        { status: 500, headers: corsHeaders }
      )
    }

    client = await pool.connect()
    
    // Transacción con timeout
    await client.query("BEGIN")
    await client.query(`SET LOCAL statement_timeout = ${DB_QUERY_TIMEOUT}`)

    try {
      // Insertar orden
      const orderRes = await client.query({
        text: `INSERT INTO orders (customer_name, customer_phone, total_amount)
               VALUES ($1, $2, $3) RETURNING id`,
        values: [customerName, customerPhone, totalAmount],
        rowMode: 'array'
      })
      
      const orderId = orderRes.rows[0]?.[0]
      if (!orderId) throw new Error("No se obtuvo ID de orden")

      // Insertar comprobante
      await client.query({
        text: `INSERT INTO payment_proofs (order_id, cloudinary_url)
               VALUES ($1, $2)`,
        values: [orderId, cloudinaryUrl]
      })

      // Insertar items
      for (const item of items) {
        const cleanPrice = Number(String(item.price).replace(/[^0-9.]/g, ''))
        await client.query({
          text: `INSERT INTO order_items (order_id, item_name, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
          values: [
            orderId,
            item.name.trim(),
            Math.max(1, Math.min(100, Number(item.quantity))), // Limitar cantidad 1-100
            cleanPrice
          ]
        })
      }

      await client.query("COMMIT")
      return NextResponse.json(
        { success: true, orderId, receiptUrl: cloudinaryUrl },
        { headers: corsHeaders }
      )

    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Error en transacción:", error)
      throw error
    }

  } catch (error) {
    console.error("Error general:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Error procesando solicitud",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    if (client) {
      client.release()
      console.log("Conexión liberada")
    }
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}