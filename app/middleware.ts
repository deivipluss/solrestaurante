import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Headers esenciales para Neon y Vercel
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('X-Edge-Functions', '1') // Necesario para Vercel

  // Manejar preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Length': '0'
      }
    })
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}