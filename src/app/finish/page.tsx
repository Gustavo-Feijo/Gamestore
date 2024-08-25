"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useGlobalState } from "@/context/ContextProvider";
import QRCode from "qrcode.react";
// Page for handling order finishing.
function FinishOrder() {
  // State functions for handling the changes on the database.
  const { syncCart } = useGlobalState();

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
  }, [qrCode]);

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
            setQrCode(`http://localhost:3000/api/payment/${data.orderId}`);
          }
        }}
      >
        Finish Order
      </Button>
      {qrCode && (
        <QRCode value={qrCode} size={256} level="H" includeMargin={true} />
      )}
    </main>
  );
}

export default FinishOrder;
