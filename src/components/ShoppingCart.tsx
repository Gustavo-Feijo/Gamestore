"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaCheck, FaMoneyBill, FaShoppingCart, FaTrash } from "react-icons/fa";
import { GlobalContextType, ShoppingItem } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { useGlobalState } from "@/context/ContextProvider";

// Single item of the shopping cart.
const ShoppingCartItem = ({
  item,
  updateAmount,
  removeItem,
  confirmAmountUpdate,
}: {
  item: ShoppingItem;
  updateAmount: Pick<GlobalContextType, "updateAmount">["updateAmount"];
  removeItem: Pick<GlobalContextType, "removeItem">["removeItem"];
  confirmAmountUpdate: Pick<
    GlobalContextType,
    "confirmAmountUpdate"
  >["confirmAmountUpdate"];
}) => {
  return (
    <div className="flex p-2 border border-border rounded shadow shadow-secondary">
      <div className="aspect-[3/4] h-full relative">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={128}
          className="object-cover h-full max-h-32 w-full"
        />
      </div>
      <div className="flex flex-col items-center w-52 max-w-52 px-2">
        <h1 className="text-wrap text-lg text-center font-semibold max-h-14 min-h-14 overflow-scroll">
          {item.name}
        </h1>
        <div className="w-full h-full flex justify-around">
          <div className="flex flex-col items-center justify-between">
            <span className="flex items-center gap-1 max-w-20">
              <FaMoneyBill className="text-green-400 min-w-4" />
              <span>${(item.price * item.amount).toFixed(2)}</span>
            </span>
            <Input
              type="number"
              value={item.amount}
              onChange={(e) =>
                updateAmount(item.gameId, parseInt(e.target.value))
              }
              className="w-20"
            />
          </div>
          <div className="flex flex-col justify-between">
            <Button
              variant="outline"
              className="h-fit px-3"
              onClick={() => {
                removeItem(item.gameId);
              }}
            >
              <FaTrash />
            </Button>
            <Button
              variant="outline"
              className="h-fit px-3"
              onClick={() => {
                item.amount > 0
                  ? confirmAmountUpdate(item.gameId)
                  : removeItem(item.gameId);
              }}
            >
              <FaCheck />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shopping cart.
export default function ShoppingCart() {
  // Get the functions for changing the global state.
  const { state, removeItem, updateAmount, confirmAmountUpdate } =
    useGlobalState();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <FaShoppingCart className="text-4xl" />
          <span className="absolute text-foreground bg-background rounded-full w-6 h-6 border-foreground border right-2 bottom-0">
            {state.shoppingCart.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[540px] flex flex-col items-center"
        onPointerDownOutside={(event) => {
          // Get the target as a element.
          const target = event.target as HTMLElement | null;

          // Get the closes li. If the click is inside the toast, then it will be the toast itself.
          const toast = target?.closest("li");

          // Verify if there is any li and if it has the sonner attribute.
          if (toast && toast.hasAttribute("data-sonner-toast")) {
            // Prevent default behaviour to avoid the sheet being closed on toast click.
            event.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-4xl">Shopping Cart</SheetTitle>
          <SheetDescription className="text-center">
            Your current selected items...
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-scroll">
          {state.shoppingCart.length === 0 ? (
            <span className="text-3xl">Start buying...</span>
          ) : (
            state.shoppingCart.map((item, index) => (
              <ShoppingCartItem
                key={index}
                item={item}
                updateAmount={updateAmount}
                removeItem={removeItem}
                confirmAmountUpdate={confirmAmountUpdate}
              />
            ))
          )}
        </div>
        {state.shoppingCart.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="flex items-center justify-around w-full border rounded p-2">
              <span className="font-bold">
                Total: $
                {state.shoppingCart.reduce(
                  (prev, cur) => (prev += cur.price * cur.amount),
                  0
                )}
              </span>
              <Link
                href="finish"
                className={buttonVariants({ variant: "default" })}
              >
                Finish Order
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
