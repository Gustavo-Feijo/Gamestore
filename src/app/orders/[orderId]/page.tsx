import { Separator } from "@/components/ui/separator";
import prisma from "@/server/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import OrderProductEntry from "@/components/OrderPage/OrderProductEntry";
import { auth } from "@/auth";
async function Order({ params }: { params: { orderId: string } }) {
  const session = await auth();
  if (!session)
    return (
      <div className="w-full flex justify-center text-red-500 text-5xl">
        You are not authorized, signIn.
      </div>
    );
  // Get the data for a specific order.
  const order = await prisma.sales.findFirst({
    where: { id: params.orderId },
    include: {
      products: {
        include: { game: { select: { price: true, image: true, name: true } } },
      },
    },
  });
  // Verify if the order was found.
  if (!order) {
    return notFound();
  }

  // Variable to hold the QR Code if the order wasn't paid.
  let qrCodeUrl;
  if (!order.paid) {
    qrCodeUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/payment/${params.orderId}`
    );
  }

  // Total value of the order.
  const orderTotal = order.products.reduce(
    (acc, cur) => (acc += cur.amount * cur.game.price),
    0
  );

  return (
    <main className="flex flex-col justify-center items-center gap-4 px-6 py-10 xl:px-40">
      <section className="flex flex-col">
        {qrCodeUrl && (
          <div className="bg-secondary py-4 px-8 border">
            <div className="flex flex-col w-60">
              <div className="flex justify-between text-lg">
                <span>Total:</span>
                <span className="flex-1 text-center">{orderTotal}$</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Date:</span>
                <span className="flex-1 text-center">
                  {order.createAt.toDateString()}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Status:</span>
                <span className="flex-1 text-center">
                  {order.paid ? "Paid" : "Awaiting payment"}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Games:</span>
                <span className="flex-1 text-center">
                  {order.products.length}
                </span>
              </div>
            </div>
            <Image
              src={qrCodeUrl}
              alt="Payment QRCode"
              height={256}
              width={256}
            />
          </div>
        )}
      </section>
      {qrCodeUrl && <Separator className="w-1/3" />}
      <section className="flex flex-col gap-2 border p-4 max-h-[600px] overflow-scroll">
        {order.products.map((product, index) => (
          <OrderProductEntry product={product} key={index} />
        ))}
      </section>
    </main>
  );
}

export default Order;
