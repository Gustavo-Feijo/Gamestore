import { Prisma } from "@prisma/client";

// Type for the shopping cart sync.
export type CardSync = Prisma.ShoppingItemsGetPayload<{
  include: { game: { select: { price: true; name: true; image: true } } };
}>[];

// Type for the review result.
export type ReviewDataType = Prisma.ReviewGetPayload<{}>;

// Type for the reviews.
export type ReviewData = Prisma.ReviewGetPayload<{
  select: { review: true; score: true; title: true; createAt: true; id: true };
}>;

// Type for the result of a search.
export type SearchResultType = Prisma.GameGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    Developer: { select: { name: true } };
  };
}>[];

// Type for the review result in the list.
export type ReviewListType = Prisma.ReviewGetPayload<{
  select: {
    review: true;
    score: true;
    title: true;
    createAt: true;
    id: true;
  };
}>[];

// Type for the list of games passed to the main games carousel.
export type GameList = Prisma.GameGetPayload<{
  include: { Categories: true };
}>[];

// Type for a game information.
export type GameInfo = Prisma.GameGetPayload<{
  include: {
    Categories: { select: { id: true; name: true } };
    Developer: { select: { id: true; name: true } };
  };
}>;

// Type for a product entry in an order.
export type OrderProductEntryType = Prisma.SaleProductGetPayload<{
  include: { game: { select: { price: true; image: true; name: true } } };
}>;

// Type for representing an order list.
export type OrderData = Prisma.SalesGetPayload<{
  include: { products: { include: { game: true } } };
}>;

// Type for the order list.
export type OrderList = Prisma.SalesGetPayload<{
  include: { products: { include: { game: true } } };
}>[];

// Each item of the shopping cart.
export type ShoppingItem = {
  gameId: string;
  name: string;
  image: string;
  price: number;
  amount: number;
};

// Type for the global context.
export type ShoppingCartContextType = {
  shoppingCart: ShoppingItem[];
  addItem: (item: ShoppingItem) => Promise<void>;
  removeItem: (gameId: string) => Promise<void>;
  updateAmount: (gameId: string, amount: number) => Promise<void>;
  confirmAmountUpdate: (gameId: string) => Promise<void>;
  syncCart: () => Promise<void>;
};
