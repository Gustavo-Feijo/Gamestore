import { auth } from "@/auth";
import prisma from "@/server/db";
import { NextRequest } from "next/server";
import { z, ZodError } from "zod";

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

// Schema for validating the post request object.
const PostSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  review: z.string(),
  score: z.number().min(1).max(10),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    // Get the session.
    const session = await auth();
    if (!session) {
      return new Response("You are not authorized, signIn.", { status: 401 });
    }

    // Verify if can access the user id.
    if (!session.user?.id) {
      return new Response("Could not get your user id.", { status: 401 });
    }

    // Get the params on variables.
    const gameId = params.gameId;
    const userId = session.user.id;

    // Get the response body and parse with Zod.
    const data = await req.json();
    const { review, score, title } = await PostSchema.parseAsync(data);
    // Upsert the review data.
    await prisma.review.upsert({
      where: { gameId_userId: { gameId, userId } },
      create: { review, score, title, userId, gameId },
      update: { review, score, title },
    });
    return new Response("Operation Successful.", { status: 200 });
  } catch (error) {
    console.error("Error while returning reviews:", error);
    // Handle any zod error.
    if (error instanceof ZodError) {
      return new Response("Wrong parameters.", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
