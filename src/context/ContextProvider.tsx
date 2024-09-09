"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "sonner";
import { ShoppingCartContextType, ShoppingItem } from "@/types";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateOnCart,
} from "@/context/ContextApiCall";
import reducer from "./Reducer";

// Create the context.
const ShoppingCartState = createContext<ShoppingCartContextType>({
  shoppingCart: [],
  addItem: async () => {},
  removeItem: async () => {},
  updateAmount: async () => {},
  confirmAmountUpdate: async () => {},
  syncCart: async () => {},
});

// State provider.
export function ShoppingCartStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  // The state instance.
  const [state, dispatch] = useReducer(reducer, []);

  // Function for adding a new item to the state.
  const addItem = useCallback(
    async (item: ShoppingItem) => {
      try {
        // Verify if there is any duplicate inside the state.
        const isDuplicate = state.some((cur) => cur.gameId === item.gameId);
        // Throw a error if it's duplicated.
        if (isDuplicate) {
          throw new Error("Could not add to cart.", {
            cause: "Game already on the shopping cart.",
          });
        }
        // Add the item to the cart.
        await addToCart(item.gameId);
        dispatch({ type: "ADD_ITEM", payload: item });

        // Toast to show that the item was added.
        toast.success("The game was added to your cart.", {
          action: { label: "Okay", onClick: () => {} },
        });
      } catch (error) {
        // Toast to show that a error happened.
        if (error instanceof Error) {
          toast.error("It wasn't possible to add the game to your cart", {
            description: (error.cause as string) || "No cause specified",
            action: { label: "Okay", onClick: () => {} },
          });
        }
      }
    },
    [state]
  );

  // Function to remove a item from the shopping cart.
  const removeItem = useCallback(async (gameId: string) => {
    try {
      // Remove the item from the cart.
      // Any error will be propagated.
      await removeFromCart(gameId);
      dispatch({ type: "REMOVE_ITEM", payload: gameId });

      // Toast to show that the item was removed.
      toast.success("The game was removed from your cart.", {
        action: { label: "Okay", onClick: () => {} },
      });
    } catch (error) {
      // Toast to show that a error happened.
      if (error instanceof Error) {
        toast.error("It wasn't possible to remove the game from your cart", {
          description: (error.cause as string) || "No cause specified",
          action: { label: "Okay", onClick: () => {} },
        });
      }
    }
  }, []);

  // Function to update the amount of a item into the shopping cart.
  const updateAmount = useCallback(async (gameId: string, amount: number) => {
    // Update the state.
    dispatch({ type: "UPDATE_AMOUNT", payload: { gameId, amount } });
  }, []);

  // Function to confirm the update of the amount and trigger the database.
  // Used for saving up databases calls, only being triggered when the use manually saves.
  const confirmAmountUpdate = useCallback(
    async (gameId: string) => {
      try {
        // Get the amount from the state.
        const amount = state.find((cur) => cur.gameId == gameId);
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
              action: { label: "Okay", onClick: () => {} },
            }
          );
        }
      }
    },
    [state]
  );

  // Async function to sync the cart with the database.
  const syncCart = useCallback(async () => {
    try {
      // Get the data from the api and apply it to the cart.
      const data = await getCart();
      dispatch({ type: "SYNC_CART", payload: data });

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
          description: (error.cause as string) || "No cause specified",
          action: { label: "Okay", onClick: () => {} },
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
  }, [syncCart]);

  return (
    <ShoppingCartState.Provider
      value={{
        shoppingCart: state,
        addItem,
        removeItem,
        updateAmount,
        confirmAmountUpdate,
        syncCart,
      }}
    >
      {children}
    </ShoppingCartState.Provider>
  );
}

export function useShoppingCart() {
  return useContext(ShoppingCartState);
}
