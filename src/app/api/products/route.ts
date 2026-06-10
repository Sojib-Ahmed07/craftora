import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: { slug: category } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { 
        category: true 
      }, 
      orderBy: { 
        createdAt: "desc" 
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("PUBLIC_PRODUCT_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}