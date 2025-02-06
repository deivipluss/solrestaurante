import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Length": "0",
      },
    })
  }

  return response
}

export const config = {
  matcher: "/api/:path*",
}

