"use client";
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
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/orders?page=${page}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: any[] = await response.json();
        if (result && result.length > 0) {
          // Convert each new result to a date.
          result.forEach(
            (result) => (result.createAt = new Date(result.createAt))
          );
          setOrders((prev) => [...prev, ...result]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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
