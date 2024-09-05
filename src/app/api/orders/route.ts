import { auth } from "@/auth";
import prisma from "@/server/db";
import { NextResponse } from "next/server";

// Route for handling order list calls.
export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
  }
  try {
    // Get the user id from the auth.
    const userId = req.auth.user?.id;

    // Default page size for the order list.
    const pageSize = 5;

    // Get the search params for getting the page.
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = searchParams.get("page") || "0";

    const result = await prisma.sales.findMany({
      where: { userId: userId },
      take: pageSize,
      skip: pageSize * parseInt(page),
      include: { products: { include: { game: true } } },
    });
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order list:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
  }
});
