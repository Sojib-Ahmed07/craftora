import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    // Dynamic query payload configuration
    const queryOptions: any = {
      include: {
        category: true, // Joins the relational category metadata model
      },
      orderBy: {
        id: "desc",
      },
    };

    // If an explicit category slug is active, modify query parameters
    if (categorySlug && categorySlug !== "all") {
      queryOptions.where = {
        category: {
          slug: categorySlug,
        },
      };
    }

    const products = await prisma.product.findMany(queryOptions);
    return NextResponse.json(products);
  } catch (error) {
    console.error("DATABASE_FILTER_ROUTE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to parse filtered database payload rows." }, 
      { status: 500 }
    );
  }
}