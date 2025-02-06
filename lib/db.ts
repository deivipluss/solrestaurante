import { Pool } from "pg"
import * as dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing")
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Eventos del pool para mejor monitoreo
pool.on("connect", () => {
  console.log("Base de datos: Nueva conexión establecida")
})

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de base de datos:", err)
})

export default pool