import prisma from "@/server/db";
import { NextRequest } from "next/server";

// Function to handle search requests.
export async function GET(req: NextRequest) {
  // Get the url and the search params.
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const search = searchParams.get("search") || "";

  // Default result size.
  const searchResultSize = 5;
  try {
    const result = await prisma.game.findMany({
      where: { name: { startsWith: search, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: searchResultSize,
      select: {
        id: true,
        name: true,
        image: true,
        Developer: { select: { name: true } },
      },
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error("Error while getting the search:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
