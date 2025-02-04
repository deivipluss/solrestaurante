import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function logError(context: string, error: unknown) {
  console.error(`Error en ${context}:`, {
    message: getErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    error,
  })
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const customerName = formData.get("customerName") as string
    const customerPhone = formData.get("customerPhone") as string
    const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
    const receipt = formData.get("receipt") as File
    const items = JSON.parse(formData.get("items") as string)

    console.log("Datos recibidos:", {
      customerName,
      customerPhone,
      totalAmount,
      receiptName: receipt?.name,
      itemsCount: items.length,
    })

    if (!customerName || !customerPhone || isNaN(totalAmount) || !receipt || !items) {
      console.error("Datos faltantes o inválidos:", { customerName, customerPhone, totalAmount, receipt, items })
      return NextResponse.json({ error: "Faltan datos requeridos o son inválidos" }, { status: 400 })
    }

    // Subir recibo a Cloudinary
    let cloudinaryUrl = ""
    try {
      const buffer = await receipt.arrayBuffer()
      cloudinaryUrl = await uploadToCloudinary(Buffer.from(buffer), receipt.type)
      console.log("Imagen subida a Cloudinary:", cloudinaryUrl)
    } catch (error) {
      logError("subir imagen a Cloudinary", error)
      return NextResponse.json(
        { error: "Error al procesar la imagen del recibo", details: getErrorMessage(error) },
        { status: 500 },
      )
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Insertar orden
      const orderResult = await client.query(
        "INSERT INTO orders (customer_name, customer_phone, total_amount) VALUES ($1, $2, $3) RETURNING id",
        [customerName, customerPhone, totalAmount],
      )
      const orderId = orderResult.rows[0].id
      console.log("Orden insertada con ID:", orderId)

      // Insertar comprobante de pago
      await client.query("INSERT INTO payment_proofs (order_id, cloudinary_url) VALUES ($1, $2)", [
        orderId,
        cloudinaryUrl,
      ])
      console.log("Comprobante de pago insertado")

      // Insertar items del pedido
      for (const item of items) {
        await client.query("INSERT INTO order_items (order_id, item_name, quantity, price) VALUES ($1, $2, $3, $4)", [
          orderId,
          item.name,
          item.quantity,
          Number.parseFloat(item.price.replace("S/", "")),
        ])
      }
      console.log("Items del pedido insertados")

      await client.query("COMMIT")
      console.log("Transacción completada con éxito")

      return NextResponse.json({ success: true, orderId: orderId, receiptUrl: cloudinaryUrl })
    } catch (error) {
      await client.query("ROLLBACK")
      logError("guardar la orden", error)
      return NextResponse.json(
        { error: "Error al procesar la orden", details: getErrorMessage(error) },
        { status: 500 },
      )
    } finally {
      client.release()
    }
  } catch (error) {
    logError("servidor", error)
    return NextResponse.json({ error: "Error interno del servidor", details: getErrorMessage(error) }, { status: 500 })
  }
}

