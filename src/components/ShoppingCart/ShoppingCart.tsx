"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaCheck, FaMoneyBill, FaShoppingCart, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/context/ContextProvider";
import Image from "next/image";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { GlobalContextType, ShoppingItem } from "@/types";
import { useRouter } from "next/navigation";

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
  // Instanciate the router for refreshing the page.
  const router = useRouter();

  // Function to handle the remove of a item from the cart.
  const handleRemove = async () => {
    try {
      await removeItem(item.gameId);
      toast.success("The game was removed from your cart.", {
        action: { label: "Okay", onClick: () => {} },
      });
    } catch (error: any) {
      toast.error("It wasn't possible to remove the game from your cart", {
        description: error.cause || "No cause specified",
        action: { label: "Refresh", onClick: () => router.refresh() },
      });
    }
  };

  // Function to handle a item update on the cart.
  const handleUpdate = async () => {
    if (item.amount > 0) {
      try {
        await confirmAmountUpdate(item.gameId);
        toast.success("The game was updated on your cart.", {
          action: { label: "Okay", onClick: () => {} },
        });
      } catch (err: any) {
        toast.error(
          "It wasn't possible to update the game amount on your cart",
          {
            description: err.cause || "No cause specified",
            action: { label: "Refresh", onClick: () => router.refresh() },
          }
        );
      }
    } else {
      handleRemove();
    }
  };

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
              onClick={handleRemove}
            >
              <FaTrash />
            </Button>
            <Button
              variant="outline"
              className="h-fit px-3"
              onClick={handleUpdate}
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
        <Button variant="ghost">
          <FaShoppingCart className="text-4xl" />
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
        <div className="flex flex-col gap-4">
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
      </SheetContent>
    </Sheet>
  );
}