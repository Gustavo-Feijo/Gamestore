"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useGlobalState } from "@/context/ContextProvider";

// Page for handling order finishing.
function FinishOrder() {
  // State functions for handling the changes on the database.
  const { syncCart, removeItem, updateAmount, state, confirmAmountUpdate } =
    useGlobalState();

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
    <main>
      <Button
        className="bg-green-300"
        onClick={async () => {
          const response = await fetch(
            "http://localhost:3000/api/finishOrder",
            { method: "POST" }
          );
          if (!response.ok) {
            const message = await response.text();
            toast.error(message);
          } else {
            const data = await response.json();
            setQrCode(data.QR);
            syncCart();
          }
        }}
      >
        Finish Order
      </Button>
      {qrCode && <Image src={qrCode} alt="a" width={300} height={300} />}
    </main>
  );
}

export default FinishOrder;