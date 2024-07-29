import { auth } from "@/auth";
import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

/**
 * Dynamic Route for handling specific item changes.
 * Every route is protected. The userId for the changes extracted from the session.
 * The methods are: POST, DELETE and PATCH.
 */

// Endpoint for deleting a specific item from a shopping cart.
export async function DELETE(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  // Get the session for using protecting the endpoint and getting the userId.
  const session = await auth();
  if (!session) {
    return new Response("You are not authorized, signIn.", { status: 401 });
  }
  // Get the userId and the gameId from the params.
  const userId = session.user?.id;
  const gameId = params.gameId;
  try {
    if (!userId) {
      throw new Error("Couldn't get the User Id.");
    }
    // Delete specified item for the authenticated user.
    await prisma.shoppingItems.delete({
      where: {
        userId_gameId: { userId, gameId },
      },
    });

    // Return that the items were deleted.
    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting shopping item:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Endpoint for adding a specific item to a shopping cart.
export async function POST(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  // Get the session for using protecting the endpoint and getting the userId.
  const session = await auth();
  if (!session) {
    return new Response("You are not authorized, signIn.", { status: 401 });
  }
  // Get the userId and the gameId from the params.
  const userId = session.user?.id;
  const gameId = params.gameId;
  try {
    // Verify if both are present.
    if (gameId && userId) {
      // Add the item to the user.
      await prisma.shoppingItems.create({
        data: { gameId: gameId, userId: userId, amount: 1 },
      });
    }

    return new Response("Cart updated successfully", { status: 201 });
  } catch (error) {
    console.error("Error while adding item to the cart:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        // Return a error for duplicate entries being added.
        // Should not be triggered normally due to client state logic.
        return new Response("Game already on the shopping cart.", {
          status: 409,
        });
      }
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Endpoint for updating a specific item amount on the shopping cart.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  // Get the session for using protecting the endpoint and getting the userId.
  const session = await auth();
  if (!session) {
    return new Response("You are not authorized, signIn.", { status: 401 });
  }

  try {
    // Get the amount from the json request.
    const { amount }: { amount: number } = await req.json();
    // Get the userId and the gameId from the params.
    const userId = session.user?.id;
    const gameId = params.gameId;

    // Verify if all params are present.
    if (gameId && userId && amount) {
      // Update the amount of the item for the user cart.
      await prisma.shoppingItems.update({
        where: { userId_gameId: { userId, gameId } },
        data: { amount: amount },
      });
    } else {
      throw new Error("Missing one of the parameters for updating.");
    }

    return new Response("Cart updated successfully", { status: 201 });
  } catch (error) {
    console.error("Error while adding item to the cart:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        // Return a error for duplicate entries being added.
        // Should not be triggered normally due to client state logic.
        return new Response("Game already on the shopping cart.", {
          status: 409,
        });
      }
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
