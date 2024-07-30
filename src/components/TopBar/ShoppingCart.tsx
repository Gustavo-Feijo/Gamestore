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

// ShoppingCart (TODO)
function ShoppingCart() {
  const { state, removeItem, updateAmount, confirmAmountUpdate } =
    useGlobalState();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <FaShoppingCart className="text-4xl" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col items-center">
        <SheetHeader>
          <SheetTitle className="text-4xl">Shopping Cart</SheetTitle>
          <SheetDescription className="text-center">
            Your current selected items...
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          {state.shoppingCart.length == 0 && (
            <span className="text-3xl">Start buying...</span>
          )}
          {state.shoppingCart.map((item, index) => (
            <div
              className="flex p-2 border border-border rounded shadow shadow-secondary"
              key={index}
            >
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
                      defaultValue={item.amount}
                      onChange={(e) => {
                        if (e.target.value != "") {
                          const val = parseInt(e.target.value);
                          updateAmount(item.gameId, val);
                        }
                      }}
                      className="w-20"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <Button
                      variant="outline"
                      className="h-fit px-3"
                      onClick={async () =>
                        removeItem(item.gameId)
                          .then(() => {
                            toast("The game was removed from your cart.", {
                              action: { label: "Okay", onClick: () => {} },
                            });
                          })
                          .catch((err: Error) => {
                            toast(
                              "It wasn't possible to remove the game from your cart",
                              {
                                description:
                                  (err.cause as string) || "No cause specified",
                              }
                            );
                          })
                      }
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-fit px-3"
                      onClick={async () => {
                        console.log(item);
                        item.amount > 0
                          ? confirmAmountUpdate(item.gameId)
                              .then(() => {
                                toast("The game was updated on your cart.", {
                                  action: { label: "Okay", onClick: () => {} },
                                });
                              })
                              .catch((err: Error) => {
                                toast(
                                  "It wasn't possible to update the game amount on your cart",
                                  {
                                    description:
                                      (err.cause as string) ||
                                      "No cause specified",
                                  }
                                );
                              })
                          : removeItem(item.gameId)
                              .then(() => {
                                toast("The game was removed from your cart.", {
                                  action: { label: "Okay", onClick: () => {} },
                                });
                              })
                              .catch((err: Error) => {
                                toast(
                                  "It wasn't possible to remove the game from your cart",
                                  {
                                    description:
                                      (err.cause as string) ||
                                      "No cause specified",
                                  }
                                );
                              });
                      }}
                    >
                      <FaCheck />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ShoppingCart;
