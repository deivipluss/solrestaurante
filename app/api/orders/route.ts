import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const receipt = formData.get("receipt") as File | null
    const itemsString = formData.get("items") as string | null

    if (!receipt) {
      return NextResponse.json({ success: false, error: "Comprobante requerido" }, { status: 400 })
    }

    if (!itemsString) {
      return NextResponse.json({ success: false, error: "Ítems requeridos" }, { status: 400 })
    }

    const items = JSON.parse(itemsString)

    const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB
    if (receipt.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande. Máximo 4.5MB" },
        { status: 413 },
      )
    }

    const arrayBuffer = await receipt.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let cloudinaryUrl: string
    try {
      cloudinaryUrl = await uploadToCloudinary(buffer, receipt.type)
      console.log("URL de Cloudinary:", cloudinaryUrl)
    } catch (error) {
      console.error("Error de Cloudinary:", error)
      return NextResponse.json({ success: false, error: "Error al subir imagen" }, { status: 500 })
    }

    const customerName = formData.get("customerName") as string
    const customerPhone = formData.get("customerPhone") as string
    const totalAmountString = formData.get("totalAmount") as string

    if (!customerName || !customerPhone || !totalAmountString) {
      return NextResponse.json({ success: false, error: "Faltan datos del cliente o monto total" }, { status: 400 })
    }

    const totalAmount = Number.parseFloat(totalAmountString)

    if (isNaN(totalAmount)) {
      return NextResponse.json({ success: false, error: "Monto total inválido" }, { status: 400 })
    }

    try {
      const order = await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          totalAmount,
          status: "PENDING",
          paymentProof: {
            create: {
              cloudinaryUrl,
            },
          },
          items: {
            create: items.map((item: { name: string; quantity: number; price: string }) => ({
              itemName: item.name,
              quantity: item.quantity,
              price: Number.parseFloat(item.price.replace("S/", "")),
            })),
          },
        },
        include: {
          paymentProof: true,
          items: true,
        },
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
        receiptUrl: cloudinaryUrl,
      })
    } catch (error) {
      console.error("Error en base de datos:", error)
      return NextResponse.json({ success: false, error: "Error en base de datos" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error general:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la orden" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        paymentProof: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Error al obtener los pedidos" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Estado de pedido inválido" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
        paymentProof: true,
      },
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar el pedido" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}