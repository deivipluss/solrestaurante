import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const total = Number.parseFloat(formData.get("total") as string)
    const receipt = formData.get("receipt") as File

    if (!name || !phone || !total || !receipt) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Aquí deberías manejar la subida del archivo receipt a un servicio de almacenamiento
    // y obtener la URL del archivo subido. Por ahora, usaremos un placeholder.
    const receiptUrl = "https://example.com/receipt.jpg"

    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      const result = await client.query(
        "INSERT INTO orders (name, phone, total, receipt_url) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, phone, total, receiptUrl],
      )
      await client.query("COMMIT")

      return NextResponse.json({ success: true, orderId: result.rows[0].id })
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

