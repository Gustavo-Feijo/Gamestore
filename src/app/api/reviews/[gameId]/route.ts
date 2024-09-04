import prisma from "@/server/db";
import { NextRequest } from "next/server";

// Function for getting the list of reviews.
export async function GET(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    // Get the gameId from the params.
    const gameId = params.gameId;

    const pageSize = 5;

    // Get the search params for getting the page.
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = searchParams.get("page") || "0";
    // Verify if all params are present.
    if (gameId) {
      // Get the list of reviews.
      const data = await prisma.review.findMany({
        where: { gameId: gameId },
        take: pageSize,
        skip: pageSize * parseInt(page),
        select: {
          review: true,
          score: true,
          title: true,
          createAt: true,
          id: true,
        },
      });
      return new Response(JSON.stringify(data));
    } else {
      throw new Error("Missing the gameId.");
    }
  } catch (error) {
    console.error("Error while returning reviews:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
