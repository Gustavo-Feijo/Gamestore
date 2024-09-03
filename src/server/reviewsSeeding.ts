import prisma from "./db";
import { LoremIpsum } from "lorem-ipsum";
async function Seed() {
  const user = await prisma.user.findFirst({});
  const games = await prisma.game.findMany({ take: 10 });
  if (!user || !games) {
    throw new Error("Couldn't find user or games.");
  }
  const loremGerenator = new LoremIpsum({
    sentencesPerParagraph: { max: 4, min: 2 },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  games.map(
    async ({ id }) =>
      await prisma.review.create({
        data: {
          gameId: id,
          userId: user?.id,
          review: loremGerenator.generateParagraphs(2),
          score: Math.floor(Math.random() * 10),
          title: loremGerenator.generateWords(3),
        },
      })
  );
}
Seed().then(() => console.log("Seeding sucessful."));
