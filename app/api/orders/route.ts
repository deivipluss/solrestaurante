import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Decimal } from "@prisma/client/runtime/library";

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  details?: string;
  orderId?: number;
  receiptUrl?: string;
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json({
        success: false,
        error: "Content-Type debe ser multipart/form-data"
      }, { status: 415 });
    }

    const formData = await request.formData();
    
    const {
      receipt,
      items: itemsString,
      customerName,
      customerPhone,
      totalAmount: totalAmountString
    } = Object.fromEntries(formData) as {
      receipt: File;
      items: string;
      customerName: string;
      customerPhone: string;
      totalAmount: string;
    };

    if (!receipt || !itemsString || !customerName || !customerPhone || !totalAmountString) {
      return NextResponse.json({
        success: false,
        error: "Todos los campos son requeridos"
      }, { status: 400 });
    }

    if (!/^\d{9}$/.test(customerPhone)) {
      return NextResponse.json({
        success: false,
        error: "El número de teléfono debe tener 9 dígitos"
      }, { status: 400 });
    }

    let items: OrderItem[];
    try {
      items = JSON.parse(itemsString);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Formato de items inválido");
      }

      const invalidItems = items.some(item => 
        typeof item.price !== 'number' || 
        item.price <= 0 || 
        typeof item.quantity !== 'number' || 
        item.quantity <= 0
      );

      if (invalidItems) {
        throw new Error("Los items contienen valores inválidos");
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: "Formato de items inválido"
      }, { status: 400 });
    }

    const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
    if (receipt.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: "El archivo es demasiado grande. Máximo 4.5MB"
      }, { status: 413 });
    }

    if (!receipt.type.startsWith("image/")) {
      return NextResponse.json({
        success: false,
        error: "Solo se permiten archivos de imagen"
      }, { status: 415 });
    }

    const buffer = Buffer.from(await receipt.arrayBuffer());

    let cloudinaryUrl: string;
    try {
      cloudinaryUrl = await uploadToCloudinary(buffer, receipt.type);
    } catch (error) {
      console.error("Error de Cloudinary:", error);
      return NextResponse.json({
        success: false,
        error: "Error al subir imagen",
        details: error instanceof Error ? error.message : "Error desconocido"
      }, { status: 500 });
    }

    const totalAmount = new Decimal(totalAmountString);
    if (totalAmount.isNaN() || totalAmount.lte(0)) {
      return NextResponse.json({
        success: false,
        error: "Monto total inválido"
      }, { status: 400 });
    }

    const calculatedTotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    if (Math.abs(calculatedTotal - Number(totalAmountString)) > 0.01) {
      return NextResponse.json({
        success: false,
        error: "El monto total no coincide con el cálculo de los items"
      }, { status: 400 });
    }

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
            itemName: item.itemName,
            quantity: item.quantity,
            price: new Decimal(item.price)
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
    return NextResponse.json({
      success: false,
      error: "Error al procesar la orden",
      details: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}