import pool from '@/lib/db'

async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ Conexión exitosa a la base de datos')
    console.log('Timestamp del servidor:', result.rows[0].now)
    client.release()
  } catch (err) {
    console.error('❌ Error de conexión:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()