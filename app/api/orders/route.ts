import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10")
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

  if (!name || !phone || !total || !receipt) {
    return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
  }

  // TODO: Implement file upload logic
  const receiptUrl = await uploadReceipt(receipt)

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
    return NextResponse.json({ error: "Error al procesar la orden" }, { status: 500 })
  }
}

// TODO: Implement this function to handle file upload
async function uploadReceipt(file: File): Promise<string> {
  // Implement your file upload logic here
  // For now, we'll return a placeholder URL
  console.log("Uploading file:", file.name)
  return `https://example.com/receipts/${file.name}`
}

