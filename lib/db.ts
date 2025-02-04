import { Pool } from "pg";

// 1. Definir interfaz para el certificado SSL
interface SSLConfig {
    rejectUnauthorized: boolean;
    ca?: string;
}

// 2. Configuración tipada del pool
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT?.replace(/\\n/g, '\n')
    } as SSLConfig : false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
};

const pool = new Pool(poolConfig);

// 3. Manejador de errores con tipado explícito
pool.on("error", (err: Error) => {
    console.error("Error crítico en el pool de PostgreSQL:", err);
    process.exit(1); // Código de salida válido (0-255)
});

// 4. Verificación de conexión inicial
(async () => {
    let client;
    try {
        client = await pool.connect();
        console.log("✅ Conexión a PostgreSQL establecida");
    } catch (error) {
        console.error("❌ Error conectando a PostgreSQL:", error);
        process.exit(1);
    } finally {
        if (client) client.release();
    }
})();

export default pool;