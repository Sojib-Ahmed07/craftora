// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    // 1. Clean up Better Auth sessions first to maintain database integrity
    await prisma.session.deleteMany({
      where: { userId: id },
    });

    // 2. Safely remove the core user profile instance
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User account and session tokens successfully purged.",
    }, { status: 200 });

  } catch (error) {
    console.error("ADMIN_USER_DELETE_ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to remove user record from the database layer.",
    }, { status: 500 });
  }
}