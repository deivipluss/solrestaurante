const { NextResponse } = require("next/server");
const prisma = require("@/lib/prisma");
const { uploadToCloudinary } = require("@/lib/cloudinary");

const POST = async (request) => {
  try {
    // Verificar el tipo de contenido
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, error: "Content-Type debe ser multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await request.formData();
    const receipt = formData.get("receipt");
    const itemsString = formData.get("items");

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Comprobante requerido" },
        { status: 400 }
      );
    }

    if (!itemsString) {
      return NextResponse.json(
        { success: false, error: "Ítems requeridos" },
        { status: 400 }
      );
    }

    const items = JSON.parse(itemsString);

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

    const customerName = formData.get("customerName");
    const customerPhone = formData.get("customerPhone");
    const totalAmountString = formData.get("totalAmount");

    if (!customerName || !customerPhone || !totalAmountString) {
      return NextResponse.json(
        { success: false, error: "Faltan datos del cliente o monto total" },
        { status: 400 }
      );
    }

    const totalAmount = Number.parseFloat(totalAmountString);

    if (isNaN(totalAmount)) {
      return NextResponse.json(
        { success: false, error: "Monto total inválido" },
        { status: 400 }
      );
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
          },
        },
        items: {
          create: items.map((item) => ({
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
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      receiptUrl: cloudinaryUrl,
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

const OPTIONS = async (request) => {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
};

module.exports = { POST, OPTIONS };