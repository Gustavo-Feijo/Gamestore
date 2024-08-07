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
export type Order = Prisma.SalesGetPayload<{
  include: { products: { include: { game: true } } };
}>;

export type GameInfo = Prisma.GameGetPayload<{
  include: {
    Categories: { select: { id: true; name: true } };
    Developer: { select: { id: true; name: true } };
  };
}>;
