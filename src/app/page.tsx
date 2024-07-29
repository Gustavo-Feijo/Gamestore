import GamesCarousel from "@/components/GamesCarousel";
import prisma from "@/server/db";

export default async function Home() {
  // Get a list of games to be displayed.
  // Currently returning every game for development purposes.
  // Later implement with a limited number of games and with selection parameters.
  const gameList = await prisma.game.findMany({
    include: { Categories: true },
  });
  return (
    <main className="px-6 xl:px-72">
      <div className="flex flex-col items-center py-16">
        <GamesCarousel gameList={gameList} />
      </div>
    </main>
  );
}
