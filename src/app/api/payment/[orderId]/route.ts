import { auth } from "@/auth";
import prisma from "@/server/db";
import { NextResponse } from "next/server";

// Pseudo payment route.
// Just for changing a order to paid.
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  // Get the session.
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You are not authorized, signIn." },
      { status: 401 }
    );
  }

  const userId = session.user?.id;
  try {
    // Get the order data.
    const order = await prisma.sales.findFirst({
      where: { userId: userId, id: params.orderId },
    });
    // Handle requests for a order not found.
    if (!order) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Order not found.",
        },
        { status: 404 }
      );
    }
    // Handle requests for a order that was already paid.
    if (order.paid === true) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "Order already paid.",
        },
        { status: 409 }
      );
    }

    // Update the order entry.
    await prisma.sales.update({
      where: { userId: userId, id: params.orderId, paid: false },
      data: { paid: true },
    });
    return NextResponse.json(
      { result: "Operation Successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error confirming order payment:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "A error occurred on the server. Try again",
      },
      { status: 500 }
    );
  }
}
