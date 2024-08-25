import { auth } from "@/auth";
import prisma from "@/server/db";
import QRCode from "qrcode";

// Router for handling a order finish.
// No need for body or params, so we use the auth wrapper.
export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return new Response("You are not authorized, signIn.", { status: 401 });
  }

  // Get the user id from the auth.
  const userId = req.auth.user?.id;

  try {
    // Get the cart from the user.
    const cart = await prisma.shoppingItems.findMany({
      where: { userId: userId },
    });

    // Verify if the cart is not empty.
    if (cart.length == 0) {
      return new Response("Empty shopping cart.", { status: 400 });
    }

    // Create the sale.
    const result = await prisma.sales.create({
      data: {
        userId: userId,
        products: {
          createMany: {
            data: cart.map((cartItem) => ({
              gameId: cartItem.gameId,
              amount: cartItem.amount,
            })),
          },
        },
      },
      include: { products: true },
    });

    // Clear the client shopping cart.
    await prisma.shoppingItems.deleteMany({ where: { userId: userId } });

    // Return a sucessful response.
    return new Response(JSON.stringify({ orderId: result.id }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error finishing order:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
