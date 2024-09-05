import { auth } from "@/auth";
import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
  }
  // Get the userId and the gameId from the params.
  const userId = session.user?.id;
  const gameId = params.gameId;
  try {
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Could not get the user id." },
        { status: 401 }
      );
    }
    // Delete specified item for the authenticated user.
    await prisma.shoppingItems.delete({
      where: {
        userId_gameId: { userId, gameId },
      },
    });

    // Return that the items were deleted.
    return NextResponse.json(
      { result: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting shopping item:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
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

    return NextResponse.json(
      { result: "Cart updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while adding item to the cart:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        // Return a error for duplicate entries being added.
        // Should not be triggered normally due to client state logic.
        return NextResponse.json(
          {
            error: "Conflict",
            message: "Game already on the shopping cart.",
          },
          {
            status: 409,
          }
        );
      }
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
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
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing one of the parameters for updating.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { result: "Cart updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while adding item to the cart:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        // Return a error for duplicate entries being added.
        // Should not be triggered normally due to client state logic.
        return NextResponse.json(
          {
            error: "Conflict",
            message: "Game already on the shopping cart.",
          },
          {
            status: 409,
          }
        );
      }
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
  }
}
