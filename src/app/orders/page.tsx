"use client";
import { fetchOrders } from "@/actions";
import { OrderData } from "@/types";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { Button } from "@/components/ui/button";

// Component that represents the list of orders from a given user.
export default function OrderPage() {
  // Use state for handling the orders data, the amount of displayed orders and the "Show More" button.
  const [orders, setOrders] = useState<OrderData[]>([]);
  // Pseudo page, since we are using only one single page and appending the results.
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    // Async wrapper for the useEffect.
    async function loadOrders() {
      // Call a server action for getting the orders from a given page.
      const newOrders = await fetchOrders(page);

      // Verify if there are onew orders and add then to the order list.
      // Else disable the show more button.
      if (newOrders && newOrders.length > 0) {
        setOrders((prev) => [...prev, ...newOrders]);
      } else {
        setHasMore(false);
      }
    }
    loadOrders();
  }, [page]);

  // Add one for the page.
  const handleMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <main className="flex justify-center items-center px-6 py-10 xl:px-60">
      <div>
        {orders.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {orders.map((order, index) => (
              <OrderCard orderData={order} key={index} />
            ))}
            {hasMore && (
              <Button onClick={handleMore} variant={"outline"} className="h-50">
                Show More
              </Button>
            )}
          </div>
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </main>
  );
}
