import { Prisma } from "@prisma/client";

// Each item of the shopping cart.
export type ShoppingItem = {
  gameId: string;
  name: string;
  image: string;
  price: number;
  amount: number;
};

// Initial State.
export type InitialState = { shoppingCart: ShoppingItem[] };

// Type for the global context.
export type GlobalContextType = {
  state: InitialState;
  addItem: (item: ShoppingItem) => Promise<void>;
  removeItem: (gameId: string) => Promise<void>;
  updateAmount: (gameId: string, amount: number) => Promise<void>;
  confirmAmountUpdate: (gameId: string) => Promise<void>;
  syncCart: () => Promise<void>;
};

// Type for the CardSync.
export type CardSync = Prisma.ShoppingItemsGetPayload<{
  include: { game: { select: { price: true; name: true; image: true } } };
}>[];

// Type for representing a order list.
export type OrderData = Prisma.SalesGetPayload<{
  include: { products: { include: { game: true } } };
}>;

export type ReviewData = Prisma.ReviewGetPayload<{
  select: { review: true; score: true; title: true; createAt: true; id: true };
}>;
export type GameInfo = Prisma.GameGetPayload<{
  include: {
    Categories: { select: { id: true; name: true } };
    Developer: { select: { id: true; name: true } };
  };
}>;

export type GameList = Prisma.GameGetPayload<{
  include: { Categories: true };
}>[];

export type SearchResultType = Prisma.GameGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    Developer: { select: { name: true } };
  };
}>[];
