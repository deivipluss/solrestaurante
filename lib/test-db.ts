import { testConnection } from "./db"

testConnection()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error en la prueba de conexión:", err)
    process.exit(1)
  })
