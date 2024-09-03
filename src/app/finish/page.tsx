"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useShoppingCart } from "@/context/ContextProvider";
import { QRCodeSVG } from "qrcode.react";
import { ShoppingCartItem } from "@/components/ShoppingCart";
// Page for handling order finishing.
function FinishOrder() {
  // State functions for handling the changes on the database.
  const {
    syncCart,
    shoppingCart,
    confirmAmountUpdate,
    removeItem,
    updateAmount,
  } = useShoppingCart();

  // useState for receiving a payment QR code.
  // Pseudo payment link used just with a get request as example.
  const [qrCode, setQrCode] = useState<string | null>(null);
  // Sync the state with the database on mount.
  // Force the current state of the page to match the database instead of the provided state.
  useEffect(() => {
    const fetchCartStart = async () => {
      await syncCart();
    };
    fetchCartStart();
  }, [syncCart]);

  return (
    <main className="flex flex-col items-center gap-4 pt-10">
      {shoppingCart.length > 0 ? (
        <>
          <span className="text-4xl">Games:</span>
          <div className="grid grid-cols-1 gap-4 border rounded p-2 md:grid-cols-2">
            {shoppingCart.map((item, index) => (
              <ShoppingCartItem
                key={index}
                item={item}
                updateAmount={updateAmount}
                removeItem={removeItem}
                confirmAmountUpdate={confirmAmountUpdate}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 border rounded py-2 px-4">
            <span className="text-2xl p-2">
              Total:
              {shoppingCart.reduce(
                (acc, cur) => (acc += cur.amount * cur.price),
                0
              )}
              $
            </span>
            <Button
              className="bg-green-300 text-black"
              onClick={async () => {
                const response = await fetch("/api/finishOrder", {
                  method: "POST",
                });
                if (!response.ok) {
                  const message = await response.text();
                  toast.error(message);
                } else {
                  const data = await response.json();
                  setQrCode(
                    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/payment/${data.orderId}`
                  );
                }
              }}
            >
              Finish Order
            </Button>
            {qrCode && (
              <QRCodeSVG value={qrCode} size={256} includeMargin={true} />
            )}
          </div>
        </>
      ) : (
        <span className="text-5xl">Empty Shopping Cart</span>
      )}
    </main>
  );
}

export default FinishOrder;
