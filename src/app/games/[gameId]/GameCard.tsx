"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { useGlobalState } from "@/context/ContextProvider";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GameInfo } from "@/types";

// Client component containing the game information.
function GameCard({ gameInfo }: { gameInfo: GameInfo }) {
  // State button for adding a game to the shopping cart.
  const { addItem } = useGlobalState();
  return (
    <div className="w-full h-fit flex flex-col items-center bg-background p-2 shadow-sm shadow-foreground md:max-w-[1000px]">
      <h1 className="text-4xl text-center">{gameInfo.name}</h1>
      <Separator className="my-2" />
      <div className="flex flex-col items-center justify-around md:flex-row">
        <Image
          alt={gameInfo.name}
          src={gameInfo.image}
          width={300}
          height={400}
        />
        <div className="p-6 flex flex-col w-full gap-2 md:w-1/3">
          <p className="bg-secondary p-4 rounded">{gameInfo.description}</p>
          <div className="flex justify-between">
            <span>Release Date:</span>
            <span className="text-foreground text-opacity-30">
              {gameInfo.releaseDate.toDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Developer:</span>
            <div className="p-2 bg-secondary rounded">
              {gameInfo.Developer.name}
            </div>
          </div>
          <div className="flex items-center">
            <span>Categories:</span>
            <div className="flex p-2 gap-2 overflow-scroll">
              {gameInfo.Categories.map((category, index) => (
                <div className="p-2 bg-secondary rounded" key={index}>
                  {category.name}
                </div>
              ))}
            </div>
          </div>
          <Button
            className="bg-green-300 rounded h-fit p-0"
            onClick={async () => {
              await addItem({
                gameId: gameInfo.id,
                amount: 1,
                image: gameInfo.image,
                name: gameInfo.name,
                price: gameInfo.price,
              });
            }}
          >
            <span className="text-black font-extrabold flex items-center p-3 gap-2">
              Buy for ${gameInfo.price}
              <FaShoppingCart className="text-4xl text-black" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
