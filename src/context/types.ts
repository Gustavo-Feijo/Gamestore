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
};
