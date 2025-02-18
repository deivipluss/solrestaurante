import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Decimal } from "@prisma/client/runtime/library";

// Interfaces para mejor tipado
interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

export const POST = async (request: Request) => {
  try {
    // Verificar el tipo de contenido
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, error: "Content-Type debe ser multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await request.formData();
    
    // Extraer datos del formulario
    const receipt = formData.get("receipt") as File;
    const itemsString = formData.get("items") as string;
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const totalAmountString = formData.get("totalAmount") as string;

    // Validaciones de campos requeridos
    if (!receipt || !itemsString || !customerName || !customerPhone || !totalAmountString) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validar teléfono (9 dígitos)
    if (!/^\d{9}$/.test(customerPhone)) {
      return NextResponse.json(
        { success: false, error: "El número de teléfono debe tener 9 dígitos" },
        { status: 400 }
      );
    }

    // Validar y parsear items
    let items: OrderItem[];
    try {
      items = JSON.parse(itemsString);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Formato de items inválido");
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Formato de items inválido" },
        { status: 400 }
      );
    }

    // Validar tamaño del archivo
    const MAX_SIZE = 4.5 * 1024 * 1024; // 4.5MB
    if (receipt.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande. Máximo 4.5MB" },
        { status: 413 }
      );
    }

    const arrayBuffer = await receipt.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validar tipo de archivo
    if (!receipt.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Solo se permiten archivos de imagen" },
        { status: 415 }
      );
    }

    // Subir imagen a Cloudinary
    let cloudinaryUrl;
    try {
      cloudinaryUrl = await uploadToCloudinary(buffer, receipt.type);
      console.log("URL de Cloudinary:", cloudinaryUrl);
    } catch (error) {
      console.error("Error de Cloudinary:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Error al subir imagen",
          details: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 500 }
      );
    }

    // Validar y convertir monto total
    const totalAmount = new Decimal(totalAmountString);

    if (totalAmount.isNaN() || totalAmount.lte(0)) {
      return NextResponse.json(
        { success: false, error: "Monto total inválido" },
        { status: 400 }
      );
    }

    // Crear orden en la base de datos
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        totalAmount,
        status: "PENDING",
        paymentProof: {
          create: {
            cloudinaryUrl,
          }
        },
        items: {
          create: items.map((item) => ({
            itemName: item.name,
            quantity: item.quantity,
            price: new Decimal(item.price.replace("S/", ""))
          }))
        }
      },
      include: {
        paymentProof: true,
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      receiptUrl: cloudinaryUrl
    });

  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la orden",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const OPTIONS = async (request: Request) => {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    }
  );
};