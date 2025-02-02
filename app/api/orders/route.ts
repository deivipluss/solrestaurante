import { NextResponse } from "next/server"
import pool from "@/db"

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM orders")
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener las órdenes:", error)
    return NextResponse.json({ error: "Error al obtener las órdenes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const total = Number.parseFloat(formData.get("total") as string)
  const receipt = formData.get("receipt") as File

  // Aquí deberías manejar la subida del archivo receipt a un servicio de almacenamiento
  // y obtener la URL del archivo subido. Por ahora, usaremos un placeholder.
  const receiptUrl = "https://example.com/receipt.jpg"

  try {
    const client = await pool.connect()
    const result = await client.query(
      "INSERT INTO orders (name, phone, total, receipt_url) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, phone, total, receiptUrl],
    )
    client.release()

    return NextResponse.json({ success: true, orderId: result.rows[0].id })
  } catch (error) {
    console.error("Error al guardar la orden:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la orden" }, { status: 500 })
  }
}

