import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
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

    // Crear orden en la base de datos usando Prisma
    try {
      const order = await prisma.order.create({
        data: {
          customerName: formData.get("customerName") as string,
          customerPhone: formData.get("customerPhone") as string,
          totalAmount: parseFloat(formData.get("totalAmount") as string),
          paymentProof: {
            create: {
              cloudinaryUrl: cloudinaryUrl
            }
          },
          items: {
            create: items.map((item: any) => ({
              itemName: item.name,
              quantity: item.quantity,
              price: parseFloat(item.price.replace("S/", ""))
            }))
          }
        },
        include: {
          paymentProof: true,
          items: true
        }
      })

      return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        receiptUrl: cloudinaryUrl 
      })

    } catch (error) {
      console.error("Error en base de datos:", error)
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
  }
}