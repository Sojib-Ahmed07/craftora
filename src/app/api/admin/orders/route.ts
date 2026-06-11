import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET handler: Fetches all orders across the system for admins
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(allOrders);
  } catch (error) {
    return NextResponse.json({ error: "Failed order sync fetch" }, { status: 500 });
  }
}

// PATCH handler: Updates order shipping fulfillment status flag
export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    const { orderId, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed mutation pass" }, { status: 500 });
  }
}