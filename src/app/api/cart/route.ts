import { auth } from "@/auth";
import prisma from "@/server/db";

// Route for getting all the items from a players cart.
// Using the auth wrapper since we don't need to get any params.
export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return new Response("You are not authorized, signIn.", { status: 401 });
  }
  // Get the user id from the auth.
  const userId = req.auth.user?.id;
  try {
    // Get all the shopping items from the user and return it.
    const data = await prisma.shoppingItems.findMany({
      where: { userId: userId },
      include: { game: { select: { price: true, name: true, image: true } } },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching shopping items:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
