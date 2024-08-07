"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { GlobalContextType, InitialState, ShoppingItem } from "@/types";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateOnCart,
} from "@/context/ContextApiCall";

// Type for the CardSync.
export type CardSync = Prisma.ShoppingItemsGetPayload<{
  include: { game: { select: { price: true; name: true; image: true } } };
}>[];

// Create the context.
const GlobalState = createContext<GlobalContextType>({
  state: { shoppingCart: [] },
  addItem: async () => {},
  removeItem: async () => {},
  updateAmount: async () => {},
  confirmAmountUpdate: async () => {},
});

// State provider.
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  // The state instance.
  const [state, setState] = useState<InitialState>({ shoppingCart: [] });

  // Function for adding a new item to the state.
  const addItem = useCallback(
    async (item: ShoppingItem) => {
      try {
        // Verify if there is any duplicate inside the state.
        const isDuplicate = state.shoppingCart.some(
          (cur) => cur.gameId === item.gameId
        );
        // Throw a error if it's duplicated.
        if (isDuplicate) {
          throw new Error("Could not add to cart.", {
            cause: "Game already on the shopping cart.",
          });
        }
        // Add the item to the database.
        await addToCart(item.gameId);

        // Update the state
        setState((prevState) => ({
          shoppingCart: [...prevState.shoppingCart, item],
        }));

        // Toast to show that the item was added.
        toast.success("The game was added to your cart.", {
          action: { label: "Okay", onClick: () => {} },
        });
      } catch (error) {
        // Toast to show that a error happened.
        if (error instanceof Error) {
          toast.error("It wasn't possible to add the game to your cart", {
            description: (error.cause as string) || "No cause specified",
          });
        }
      }
    },
    [state.shoppingCart]
  );

  // Function to remove a item from the shopping cart.
  const removeItem = useCallback(
    async (gameId: string) => {
      try {
        // Remove the item from the cart.
        // Any error will be propagated.
        await removeFromCart(gameId);

        // Update the state by filtering the shopping cart for the item id.
        setState((prevState) => ({
          ...prevState,
          shoppingCart: prevState.shoppingCart.filter(
            (cur) => cur.gameId !== gameId
          ),
        }));

        // Toast to show that the item was removed.
        toast.success("The game was removed from your cart.", {
          action: { label: "Okay", onClick: () => {} },
        });
      } catch (error) {
        // Toast to show that a error happened.
        if (error instanceof Error) {
          toast.error("It wasn't possible to remove the game from your cart", {
            description: (error.cause as string) || "No cause specified",
          });
        }
      }
    },
    [state.shoppingCart]
  );

  // Function to update the amount of a item into the shopping cart.
  const updateAmount = useCallback(
    async (gameId: string, amount: number) => {
      // Update the state by changing the amount of the item with the passed id.
      setState((prevState) => ({
        ...prevState,
        shoppingCart: prevState.shoppingCart.map((cur) =>
          cur.gameId === gameId ? { ...cur, amount: amount } : cur
        ),
      }));
    },
    [state.shoppingCart]
  );

  // Function to confirm the update of the amount and trigger the database.
  // Used for saving up databases calls, only being triggered when the use manually saves.
  const confirmAmountUpdate = useCallback(
    async (gameId: string) => {
      try {
        // Get the amount from the state.
        const amount = state.shoppingCart.find((cur) => cur.gameId == gameId);
        if (amount) {
          await updateOnCart(gameId, amount.amount);
        }

        // Toast to show that the item was updated.
        toast.success("The game was updated on your cart.", {
          action: { label: "Okay", onClick: () => {} },
        });
      } catch (error) {
        // Toast to show that a error happened.
        if (error instanceof Error) {
          toast.error(
            "It wasn't possible to update the game amount on your cart",
            {
              description: (error.cause as string) || "No cause specified",
            }
          );
        }
      }
    },
    [state.shoppingCart]
  );

  // Async function to sync the cart with the database.
  const syncCart = useCallback(async () => {
    try {
      // Get the data from the api and apply it to the cart.
      const data = await getCart();
      if (data.length > 0) {
        setState({
          shoppingCart: data.map(({ game, userId, ...item }) => ({
            ...item,
            ...game,
          })),
        });
      }

      // Toast to show that the cart was synchronized.
      toast.success(
        "The cart was sucessfully synchronized with the database.",
        {
          action: { label: "Okay", onClick: () => {} },
        }
      );
    } catch (error) {
      // Toast to show that a error happened.
      if (error instanceof Error) {
        toast.error("Couldn't sync the cart with the database.", {
          description: "Try refreshing the page.",
        });
      }
    }
  }, []);

  // Sync the state with the database on mount.
  useEffect(() => {
    const fetchCartStart = async () => {
      await syncCart();
    };
    fetchCartStart();
  }, []);

  return (
    <GlobalState.Provider
      value={{ state, addItem, removeItem, updateAmount, confirmAmountUpdate }}
    >
      {children}
    </GlobalState.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalState);
}
