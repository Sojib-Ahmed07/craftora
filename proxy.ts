import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export async function proxy(request: NextRequest) {
  const url = new URL(request.url);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    }
  );

  if (url.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (url.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};