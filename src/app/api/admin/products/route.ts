import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admin authorization required." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, description, price, stock, categoryId, images } = body;

    console.log("DEBUG_PAYLOAD_RECEIVED:", {
      name,
      description,
      price,
      typeOfPrice: typeof price,
      stock,
      categoryId,
      images,
    });
    // Strict validation: check for missing values using explicit null/undefined checks
    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      price === "" ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, description, price, and categoryId are required.",
        },
        { status: 400 },
      );
    }

    // Safely parse metrics before letting Prisma validate the data types
    const parsedPrice = parseFloat(price);
    const parsedStock =
      stock !== undefined && stock !== null && stock !== ""
        ? parseInt(stock, 10)
        : 0;

    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: "The provided price field must be a valid number format." },
        { status: 400 },
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Clean out empty string array items created by your frontend form's imagery fallback logic
    const cleanImages = Array.isArray(images)
      ? images.filter((img) => typeof img === "string" && img.trim() !== "")
      : [];

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parsedPrice,
        stock: isNaN(parsedStock) ? 0 : parsedStock,
        images: cleanImages,
        categoryId,
      },
    });

    return NextResponse.json(
      { message: "Product created successfully!", product: newProduct },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("ADMIN_PRODUCT_POST_ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
