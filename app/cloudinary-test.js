import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 1. Configurar variables de entorno
dotenv.config();

// 2. Obtener ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dasjnlinj',
  api_key: process.env.CLOUDINARY_API_KEY || '658875611319175',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Qv9_rVT1TGXUIRIBskSJB6-5ye8',
  secure: true // Forzar HTTPS
});

// 4. Función mejorada para subir imágenes
async function uploadImage(imagePath) {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Archivo no encontrado: ${imagePath}`);
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'test-uploads',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: 'auto'
    });

    // Mostrar resultados formateados
    console.log('✅ Subida exitosa:');
    console.log(`📁 Folder: ${result.folder}`);
    console.log(`🔗 URL: ${result.secure_url}`);
    console.log(`🆔 Public ID: ${result.public_id}`);
    console.log(`📏 Tamaño: ${Math.round(result.bytes / 1024)} KB`);
    
    return result;

  } catch (error) {
    console.error('❌ Error en la subida:');
    console.error(`📄 Archivo: ${path.basename(imagePath)}`);
    console.error(`🔍 Mensaje: ${error.message}`);
    if (error.error) console.error(`📦 Error Cloudinary: ${JSON.stringify(error.error, null, 2)}`);
    process.exit(1);
  }
}

// 5. Configuración de rutas
const TEST_IMAGE = process.env.TEST_IMAGE || 'test-image.jpg';
const imagePath = path.resolve(__dirname, TEST_IMAGE);

// 6. Ejecutar la subida
uploadImage(imagePath)
  .then(() => console.log('\n🎉 Proceso completado!'))
  .catch(() => process.exit(1));