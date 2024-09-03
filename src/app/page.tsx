import GamesCarousel from "@/components/GamesCarousel";
import GameSearch from "@/components/GameSearch";
import prisma from "@/server/db";

export default async function Home() {
  // Get a list of 5 games to be displayed.
  const gameList = await prisma.game.findMany({
    include: { Categories: true },
    take: 5,
  });
  return (
    <main className="px-6 xl:px-72">
      <div className="flex flex-col items-center py-16 gap-20">
        <GamesCarousel gameList={gameList} />
        <GameSearch />
      </div>
    </main>
  );
}
