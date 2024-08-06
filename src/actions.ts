"use server";
import { auth } from "@/auth";
import prisma from "@/server/db";

// Server action for fetching more orders.
export async function fetchOrders(page: number) {
  // Default page size.
  const pageSize = 5;
  // Get the session.
  const session = await auth();

  // Verify the session and return the result of the query.
  if (session) {
    return prisma.sales.findMany({
      where: { userId: session?.user?.id },
      take: pageSize,
      skip: pageSize * page,
      include: { products: true },
    });
  }
  return null;
}
