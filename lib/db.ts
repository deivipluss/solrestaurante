import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de la base de datos", err)
})

console.log("Configuración de la base de datos:", {
  connectionString: process.env.DATABASE_URL ? "Configurado" : "No configurado",
  ssl: process.env.NODE_ENV === "production" ? "Configurado para producción" : "Desactivado para desarrollo",
})

export default pool

