import prisma from "@/server/db";
import { NextRequest } from "next/server";

// Function to handle search requests.
export async function GET(req: NextRequest) {
  // Get the url and the search params.
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get("page") || "0");
  // Get the page size and limit it to 20.
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 20);
  const search = searchParams.get("search") || "";

  try {
    const count = await prisma.game.count();
    // Get the result.
    const result = await prisma.game.findMany({
      orderBy: { name: "asc" },
      where: { name: { startsWith: search, mode: "insensitive" } },
      take: pageSize,
      skip: pageSize * page,
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
      },
    });
    // Return the result and if there is any other result to be fetched.
    return new Response(
      JSON.stringify({ result, hasMore: count > pageSize * (page + 1) })
    );
  } catch (error) {
    console.error("Error while getting the search:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
