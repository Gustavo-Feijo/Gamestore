import { Order } from "@/types";
import Image from "next/image";

function OrderCard({ orderData }: { orderData: Order }) {
  return (
    <div className="h-40 bg-secondary">
      <div className="flex">
        {orderData.products.splice(0, 2).map((game, index) => (
          <Image
            src={game.game.image}
            width={120}
            height={160}
            alt={game.game.image}
            key={index}
          />
        ))}
      </div>
      {orderData.id}
    </div>
  );
}

export default OrderCard;
