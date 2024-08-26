"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaShoppingCart } from "react-icons/fa";
import { useGlobalState } from "@/context/ContextProvider";
import Link from "next/link";
import { GameList } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Carousel containing cards of games.
function GamesCarousel({ gameList }: { gameList: GameList }) {
  // Get the addItem function to add a Item to the shopping cart.
  const { addItem } = useGlobalState();

  // Plugin for autoplay of the carousel.
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  //Carousel containing the games cards with images, information and button to buy.
  return (
    <Carousel
      className="shadow-lg shadow-black"
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-[calc(100vw-100px)] sm:w-[580px] lg:w-[1000px]">
        {gameList.map((game, index) => (
          <CarouselItem key={index}>
            <Card className="flex flex-col items-center min-h-full lg:flex-row overflow-hidden">
              <Link
                href={`/games/${game.id}`}
                className="w-full aspect-[16/9] md:w-[640px] lg:h-auto relative"
              >
                <Image
                  src={game.imageBg}
                  alt={game.name}
                  className="object-cover h-full"
                  width={640}
                  height={360}
                />
              </Link>
              <div className="flex flex-col justify-around flex-1 min-h-full">
                <CardHeader className="flex-1 p-2">
                  <CardTitle className="text-3xl min-h-24 text-center flex items-center justify-center">
                    {game.name}
                  </CardTitle>
                  <CardDescription className="h-14 max-h-14 overflow-y-auto">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-16 max-h-16 p-2 bg-secondary rounded justify-start items-center gap-2 overflow-hidden">
                    {game.Categories.length > 0
                      ? game.Categories.map((category, index) => (
                          <span
                            className="bg-foreground bg-opacity-20 p-1 rounded"
                            key={index}
                          >
                            {category.name}
                          </span>
                        ))
                      : "No Categories"}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    className="bg-green-300 rounded h-fit p-0"
                    onClick={async () => {
                      await addItem({
                        gameId: game.id,
                        amount: 1,
                        image: game.image,
                        name: game.name,
                        price: game.price,
                      });
                    }}
                  >
                    <span className="text-black font-extrabold flex items-center p-3 gap-2">
                      Buy for ${game.price}
                      <FaShoppingCart className="text-4xl text-black" />
                    </span>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default GamesCarousel;
