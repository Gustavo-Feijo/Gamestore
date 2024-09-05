import { FaGamepad, FaMoneyBill } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { OrderData } from "@/types";
import { buttonVariants } from "@/components/ui/button";

function OrderCard({ orderData }: { orderData: OrderData }) {
  return (
    <div className="flex flex-col bg-secondary rounded px-2 shadow-md shadow-secondary">
      <div className="border-b border-foreground text-center">
        Order Date: {orderData.createAt.toDateString()}
      </div>
      <div className="h-44 flex justify-start px-2 items-center">
        <Image
          src={orderData.products[0].game.image}
          width={120}
          height={160}
          alt={orderData.products[0].game.image}
          className="aspect-[3/4]"
        />
        <div className="flex flex-col h-full items-center justify-between p-2 min-w-52">
          {orderData.paid ? (
            <span className="text-green-300 text-lg">Paid</span>
          ) : (
            <span className="text-orange-300 text-lg">Awaiting Payment</span>
          )}
          <span className="flex items-center gap-2">
            <FaGamepad className="text-yellow-300" />
            Games: {orderData.products.length}
          </span>
          <span className="flex items-center gap-2">
            <FaMoneyBill className="text-green-300" />
            Total:
            {orderData.products.reduce(
              (prev, cur) => (prev += cur.game.price * cur.amount),
              0
            )}
          </span>
          <Link
            href={`/orders/${orderData.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Open order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
