import Image from "next/image";
import prisma from "@/server/db";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaShoppingCart } from "react-icons/fa";

const monthList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

async function page({ params }: { params: { game: string } }) {
  const data = await prisma.game.findFirst({
    include: { Developer: true, Categories: true },
    where: { id: params.game },
  });
  console.log(data);
  if (!data) notFound();

  return (
    <main className="flex-1 flex justify-center p-10">
      <div className="bg-secondary bg-opacity-40 w-3/5 p-10 flex flex-col gap-10">
        <section className="flex justify-between">
          <Image
            alt={data.name}
            src="/DS3.jpg"
            className="rounded"
            width={375}
            height={500}
          />
          <div className="flex-1 px-28 flex flex-col gap-8">
            <h1 className="text-6xl text-center">{data.name}</h1>
            <p className="h-40 overflow-scroll">
              {data.name}: {data.description}
            </p>
            <Separator className="bg-foreground" />
            <div className="w-3/5 flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Release Date:</span>
                <span className="tracking-wider">
                  {data.releaseDate.getDate()} of{" "}
                  {monthList[data.releaseDate.getMonth()]} /
                  {data.releaseDate.getFullYear()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Developer: </span>
                <span>{data.Developer.name}</span>
              </div>
            </div>
            <div className="min-h-10 max-h-20 bg-background bg-opacity-20 border border-border border-opacity-80 rounded flex items-center px-2">
              {data.Categories.length > 0
                ? data.Categories.map((category, index) => (
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={`/category/${category.name}`}
                      key={index}
                    >
                      {category.name}
                    </Link>
                  ))
                : "No Category"}
            </div>
          </div>
        </section>
        <Separator />
        <section className="flex justify-around">
          <div className="flex border-border border rounded-md bg-foreground bg-opacity-10 items-center p-1">
            <span className="text-wrap max-w-72 text-center">
              Add {data.name} to your Shopping Cart...
            </span>
            <Button variant="outline" className="h-fit">
              <FaShoppingCart className="text-5xl text-green-400" />
            </Button>
          </div>
          <div className="flex-1">View Reviews</div>
        </section>
      </div>
    </main>
  );
}

export default page;
