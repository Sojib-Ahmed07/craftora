// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";
// import { NextRequest, NextResponse } from "next/server";

// const authHandlers = toNextJsHandler(auth);

// export async function GET(request: NextRequest) {
//   const url = new URL(request.url);

//   // If it's an authentication endpoint, let Better Auth handle it directly
//   if (url.pathname.startsWith("/api/auth")) {
//     // Pass the raw request clone directly so Better Auth evaluates the pure URL
//     return authHandlers.GET(new Request(request.url, request));
//   }

//   // --- YOUR EXISTING GET ENDPOINTS HERE ---
//   return NextResponse.json({ error: "Endpoint Not Found" }, { status: 404 });
// }

// export async function POST(request: NextRequest) {
//   const url = new URL(request.url);

//   if (url.pathname.startsWith("/api/auth")) {
//     // Pass a fresh standard Request object with cloned headers and body contexts
//     return authHandlers.POST(new Request(request.url, request));
//   }

//   // --- YOUR EXISTING POST ENDPOINTS HERE ---
//   return NextResponse.json({ error: "Endpoint Not Found" }, { status: 404 });
// }

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const authHandlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/auth")) {
    return authHandlers.GET(request);
  }

  return NextResponse.json({ error: "Endpoint Not Found" }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/auth")) {
    return authHandlers.POST(request);
  }

  return NextResponse.json({ error: "Endpoint Not Found" }, { status: 404 });
}
