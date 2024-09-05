import { OrderProductEntryType } from "@/types";
import Image from "next/image";
import Link from "next/link";

// Component for rendering a product entry from a order.
function OrderProductEntry({ product }: { product: OrderProductEntryType }) {
  return (
    <div className="flex gap-2 border p-2 rounded">
      <Link href={`/games/${product.gameId}`}>
        <Image
          alt={product.game.name}
          src={product.game.image}
          height={160}
          width={120}
          className="aspect-[3/4]"
        />
      </Link>
      <div className="flex flex-col w-full items-center">
        <span className="text-xl text-center w-full">{product.game.name}</span>
        <div className="flex flex-col h-full justify-around max-w-80">
          <div className="flex justify-between text-lg">
            <span className="min-w-20">Price:</span>
            <span className="flex-1 text-center">{product.game.price}$</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="min-w-20">Amount:</span>
            <span className="flex-1 text-center">{product.amount}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="min-w-20">Total:</span>
            <span className="flex-1 text-center">
              {product.amount * product.game.price}$
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderProductEntry;
