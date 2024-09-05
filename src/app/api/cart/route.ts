import { auth } from "@/auth";
import prisma from "@/server/db";
import { NextResponse } from "next/server";

// Route for getting all the items from a players cart.
// Using the auth wrapper since we don't need to get any params.
export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
  }
  // Get the user id from the auth.
  const userId = req.auth.user?.id;
  try {
    // Get all the shopping items from the user and return it.
    const result = await prisma.shoppingItems.findMany({
      where: { userId: userId },
      include: { game: { select: { price: true, name: true, image: true } } },
      orderBy: { game: { name: "asc" } },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shopping items:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
  }
});
