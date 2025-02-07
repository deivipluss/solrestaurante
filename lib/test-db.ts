import { testConnection } from "./db"

testConnection()
  .then((success) => {
    if (success) {
      console.log("Prueba de conexión completada exitosamente.")
      process.exit(0)
    } else {
      console.error("La prueba de conexión falló.")
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("Error inesperado durante la prueba de conexión:", err)
    process.exit(1)
  })

