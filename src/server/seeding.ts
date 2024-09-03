import prisma from "./db";

async function Seed() {
  // Seeding for the categories.
  const categories = await prisma.categories.createManyAndReturn({
    data: [
      { name: "RPG" },
      { name: "Action" },
      { name: "Simulation" },
      { name: "Adventure" },
      { name: "Sports" },
      { name: "Fighting" },
      { name: "FPS" },
    ],
  });
  const developers = await prisma.developer.createManyAndReturn({
    data: [
      { name: "Ubisoft" },
      { name: "Electronic Arts" },
      { name: "Bethesda Softworks" },
      { name: "Rockstar Games" },
      { name: "Square Enix" },
      { name: "Activision Blizzard" },
      { name: "Nintendo" },
      { name: "Capcom" },
      { name: "Valve Corporation" },
      { name: "CD Projekt Red" },
      { name: "Bandai Namco" },
      { name: "Sony" },
      { name: "Bungie" },
      { name: "Insomniac" },
      { name: "From Software" },
      { name: "Naughty Dog" },
      { name: "Konami" },
      { name: "2K" },
      { name: "Epic Games" },
      { name: "Respawn" },
    ],
  });

  // Game Data for seeding.
  // Mostly generated by LLM.
  const gameData = [
    {
      name: "Elden Ring",
      description: "An action RPG developed by From Software.",
      releaseDate: new Date("2022-02-25"),
      price: 59.99,
      developerName: "From Software",
      categories: ["Action", "RPG"],
      image: "/games/ER.avif",
      imageBg: "/games/ERBG.jpg",
    },
    {
      name: "The Witcher 3: Wild Hunt",
      description: "An open-world RPG developed by CD Projekt Red.",
      releaseDate: new Date("2015-05-19"),
      price: 39.99,
      developerName: "CD Projekt Red",
      categories: ["RPG", "Adventure"],
      image: "/games/W3.webp",
      imageBg: "/games/W3BG.jpeg",
    },
    {
      name: "Grand Theft Auto V",
      description: "An open-world action game developed by Rockstar Games.",
      releaseDate: new Date("2013-09-17"),
      price: 29.99,
      developerName: "Rockstar Games",
      categories: ["Action", "Adventure"],
      image: "/games/GTA5.jpg",
      imageBg: "/games/GTA5BG.jpeg",
    },
    {
      name: "The Legend of Zelda: Breath of the Wild",
      description: "An open-world action-adventure game developed by Nintendo.",
      releaseDate: new Date("2017-03-03"),
      price: 59.99,
      developerName: "Nintendo",
      categories: ["Action", "Adventure"],
      image: "/games/ZeldaBTW.png",
      imageBg: "/games/ZeldaBTWBG.png",
    },
    {
      name: "Cyberpunk 2077",
      description: "An open-world RPG developed by CD Projekt Red.",
      releaseDate: new Date("2020-12-10"),
      price: 49.99,
      developerName: "CD Projekt Red",
      categories: ["RPG", "Action"],
      image: "/games/Cyberpunk2077.jpeg",
      imageBg: "/games/Cyberpunk2077BG.jpg",
    },
    {
      name: "Assassin's Creed Valhalla",
      description: "An action RPG developed by Ubisoft.",
      releaseDate: new Date("2020-11-10"),
      price: 59.99,
      developerName: "Ubisoft",
      categories: ["Action", "RPG"],
      image: "/games/Valhalla.png",
      imageBg: "/games/ValhallaBG.jpg",
    },
    {
      name: "Red Dead Redemption 2",
      description:
        "An open-world action-adventure game developed by Rockstar Games.",
      releaseDate: new Date("2018-10-26"),
      price: 59.99,
      developerName: "Rockstar Games",
      categories: ["Action", "Adventure"],
      image: "/games/RDR2.webp",
      imageBg: "/games/RDR2BG.jpg",
    },
    {
      name: "Street Fighter V",
      description: "A fighting game developed by Capcom.",
      releaseDate: new Date("2016-02-16"),
      price: 39.99,
      developerName: "Capcom",
      categories: ["Fighting", "Action"],
      image: "/games/SF5.png",
      imageBg: "/games/SF5BG.jpg",
    },
  ];
  gameData.map(
    async (game) =>
      await prisma.game.create({
        data: {
          name: game.name,
          description: game.description,
          image: game.image,
          imageBg: game.imageBg,
          price: game.price,
          releaseDate: game.releaseDate,
          developerId:
            developers.find((cur) => cur.name == game.developerName)?.id || " ",
          Categories: {
            connect: game.categories.map((category) => ({
              id: categories.find((cur) => cur.name == category)?.id || " ",
            })),
          },
        },
        include: { Categories: true, Developer: true },
      })
  );
}
Seed().then(() => console.log("Seeding sucessful."));