import { Pool } from "pg"

// Configuración optimizada para Neon.tech
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: true,
    ca: `
      -----BEGIN CERTIFICATE-----
      MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh
      MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
      d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD
      QTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT
      MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j
      b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG
      9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB
      CSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97
      NH6ZveMeIj3IZQZmAFkLfG1+rGqzzd+5aCj6HE6Widgetc7T6ZkqA2v6U0q27ck0
      Fu4s4U2U6phCZnQZ8jvdq97hL6jKKBUCs0YDh6Fwac8CG+MVT0BMf3Sn7UHFZEcr
      AgMBAAGjggFbMIIBVzAfBgNVHSMEGDAWgBQD3lA1U2sdWMld/+7WkDFOod6XizAd
      BgNVHQ4EFgQUA95QNVNrHVjJXf/u1pAxTqHel4swDgYDVR0PAQH/BAQDAgGGMB0G
      A1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjBJBgNVHR8EQjBAMD6gPKA6hjho
      dHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGlnaUNlcnRHbG9iYWxSb290Q0EuY3Js
      MGAGCCsGAQUFBwEBBFQwUjBQBggrBgEFBQcwAoZEaHR0cDovL2NhY2VydHMuZGln
      aWNlcnQuY29tL0RpZ2lDZXJ0R2xvYmFsUm9vdENBLmNydDAMBgNVHRMBAf8EAjAA
      MA0GCSqGSIb3DQEBBQUAA4IBAQBOZvEWOQ6b2Bl7a8sYa8+JjQqz1qDvr/7TZ6D1
      qRk5LvWRkXeu5OlBsZYJgxy6lshxOYDl0WCCD7i2HDP3YHv4YgbV4Nq+Wv5j8ba0
      rIYSeJY8B+wBQNUp8jsMIGJBQuADDOjJiiNnu4M8g2SbJjhp0m0nVXZojBcK7hVg
      kh3wY4MpK8ZDoX5Na5UsMeChCskIGdLDtOmGgW7btSZqDWe2WmSSrhdYzVgLQwWN
      elMq6V1wg8BtGW1a0n1J2YFdA17+q3L9RCyUI4/9Y4pJACZ2cZ6A7sJYfVflo2Cq
      h8NdxAuq1Zh4kqimZVSa1B+7BimFfqD2WvC9L
      -----END CERTIFICATE-----
    `
  } : false,
  connectionTimeoutMillis: 8000,  // Aumentado para conexiones remotas
  idleTimeoutMillis: 30000,
  max: 20  // Nuevo: Limitar conexiones simultáneas
}

const pool = new Pool(poolConfig)

// Manejador de errores mejorado
pool.on('error', (err: Error) => {
  console.error('⚠️ Error en el pool de PostgreSQL:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'Oculto en producción'
  })
})

// Verificación de conexión con diagnóstico extendido
;(async () => {
  const client = await pool.connect().catch(err => {
    console.error('🚨 Fallo de conexión a Neon.tech:', {
      error_code: err.code,
      message: err.message,
      hint: 'Verifique: 1) Certificado SSL 2) Credenciales 3) Red'
    })
    process.exit(1)
  })

  if (client) {
    try {
      const { rows } = await client.query('SELECT NOW() as server_time, version() AS pg_version')
      console.log('✅ Conexión exitosa:')
      console.log(`   Hora del servidor: ${rows[0].server_time}`)
      console.log(`   Versión PostgreSQL: ${rows[0].pg_version.split(' ')[1]}`)
    } finally {
      client.release()
    }
  }
})()

export default pool