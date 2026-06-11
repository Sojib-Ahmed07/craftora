import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authenticate and authorize the admin session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admin authorization required." },
        { status: 403 },
      );
    }

    // 2. Await the dynamic URL route parameters
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required product ID parameter." },
        { status: 400 },
      );
    }

    // 3. Optional: Verify the item exists before attempting deletion
    const targetProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!targetProduct) {
      return NextResponse.json(
        { error: "Product not found in database ledger index." },
        { status: 404 },
      );
    }

    // 4. Perform the deletion sequence
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product permanently removed from catalog successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("ADMIN_PRODUCT_DELETE_ERROR:", error);

    // Handle foreign key constraint violations (e.g., product is currently inside a user's cart)
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Cannot delete product. This item is referenced by existing orders or cart items. Clear dependencies first.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
