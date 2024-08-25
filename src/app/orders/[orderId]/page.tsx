import prisma from "@/server/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
async function Order({ params }: { params: { orderId: string } }) {
  const data = await prisma.sales.findFirst({
    where: { id: params.orderId },
    include: { products: { include: { game: true } } },
  });
  if (!data) {
    return notFound();
  }
  const qrCodeUrl = await QRCode.toDataURL(
    `http://localhost:3000/api/payment/${params.orderId}`
  );

  console.log(data);
  return (
    <main className="flex justify-center items-center px-6 py-10 xl:px-60">
      {!data.paid && (
        <Image src={qrCodeUrl} alt="Payment QRCode" height={256} width={256} />
      )}
      {params.orderId}
    </main>
  );
}

export default Order;
