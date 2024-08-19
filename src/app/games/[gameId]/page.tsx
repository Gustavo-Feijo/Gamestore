import prisma from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";
import GameCard from "./GameCard";
import ReviewCard from "./ReviewCard";

// Page for a specific game.
async function GamePage({ params }: { params: { gameId: string } }) {
  // Get game info from the database based on the gameId.
  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    include: {
      Categories: { select: { id: true, name: true } },
      Developer: { select: { id: true, name: true } },
    },
  });

  // Verify if the game was found.
  if (!game) {
    return notFound();
  }
  return (
    <main className="relative min-h-[calc(100dvh-80px)]">
      <div
        className="fixed inset-0 bg-top bg-no-repeat filter grayscale opacity-5 blur-sm"
        style={{
          backgroundImage: `url(${game.imageBg})`,
          backgroundSize: "1920px 1080px",
        }}
      />
      <div className="relative z-10 flex flex-col gap-10 items-center justify-center h-full p-6">
        <GameCard gameInfo={game} />
        <ReviewCard gameId={params.gameId} />
      </div>
    </main>
  );
}

export default GamePage;
