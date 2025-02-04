import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const formData = await request.formData()
    const customerName = formData.get("customerName") as string
    const customerPhone = formData.get("customerPhone") as string
    const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
    const receipt = formData.get("receipt") as File
    const items = JSON.parse(formData.get("items") as string)

    // Validate required fields
    if (!customerName || !customerPhone || isNaN(totalAmount) || !receipt || !items) {
      return NextResponse.json(
        { error: "Faltan datos requeridos o son inválidos" }, 
        { 
          status: 400,
          headers: corsHeaders 
        }
      )
    }

    // Upload receipt to Cloudinary
    let cloudinaryUrl = ""
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      return NextResponse.json(
        { error: "Error al procesar la imagen del recibo", details: String(error) },
        { 
          status: 500,
          headers: corsHeaders 
        }
      )
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      const orderResult = await client.query(
        "INSERT INTO orders (customer_name, customer_phone, total_amount) VALUES ($1, $2, $3) RETURNING id",
        [customerName, customerPhone, totalAmount]
      )
      const orderId = orderResult.rows[0].id

      await client.query("INSERT INTO payment_proofs (order_id, cloudinary_url) VALUES ($1, $2)", [
        orderId,
        cloudinaryUrl
      ])

      for (const item of items) {
        await client.query("INSERT INTO order_items (order_id, item_name, quantity, price) VALUES ($1, $2, $3, $4)", [
          orderId,
          item.name,
          item.quantity,
          Number.parseFloat(item.price.replace("S/", ""))
        ])
      }

      await client.query("COMMIT")

      return NextResponse.json(
        { success: true, orderId: orderId, receiptUrl: cloudinaryUrl },
        { headers: corsHeaders }
      )
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Order processing error:", error)
      return NextResponse.json(
        { error: "Error al procesar la orden", details: String(error) },
        { 
          status: 500,
          headers: corsHeaders 
        }
      )
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: String(error) },
      { 
        status: 500,
        headers: corsHeaders 
      }
    )
  }
}