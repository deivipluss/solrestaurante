import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://[admin]:[admin]@localhost:5432/BD RESTAURANTE 2025",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export default pool

