"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { GlobalContextType, InitialState, ShoppingItem } from "@/types";

// Type for the CardSync.
type CardSync = Prisma.ShoppingItemsGetPayload<{
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
  async function addItem(item: ShoppingItem) {
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

    // Update the state
    setState((prevState) => ({
      shoppingCart: [...prevState.shoppingCart, item],
    }));

    // Add the item to the database.
    await addToCart(item.gameId);
  }

  // Function to remove a item from the shopping cart.
  async function removeItem(gameId: string) {
    // Update the state by filtering the shopping cart for the item id.
    setState((prevState) => ({
      ...prevState,
      shoppingCart: prevState.shoppingCart.filter(
        (cur) => cur.gameId !== gameId
      ),
    }));
    // Remove the item from the cart.
    // Any error will be propagated.
    await removeFromCart(gameId);
  }

  // Function to update the amount of a item into the shopping cart.
  async function updateAmount(gameId: string, amount: number) {
    // Update the state by changing the amount of the item with the passed id.
    setState((prevState) => ({
      ...prevState,
      shoppingCart: prevState.shoppingCart.map((cur) =>
        cur.gameId === gameId ? { ...cur, amount: amount } : cur
      ),
    }));
  }

  // Function to confirm the update of the amount and trigger the database.
  // Used for saving up databases calls, only being triggered when the use manually saves.
  async function confirmAmountUpdate(gameId: string) {
    // Get the amount from the state.
    const amount = state.shoppingCart.find((cur) => cur.gameId == gameId);
    if (amount) {
      await updateOnCart(gameId, amount.amount);
    }
  }

  // Async function to sync the cart with the database.
  async function syncCart() {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data: CardSync = await response.json();
        if (data.length > 0) {
          setState({
            shoppingCart: data.map(({ game, userId, ...item }) => ({
              ...item,
              ...game,
            })),
          });
          toast("The cart was sucessfully synced with the database.", {
            action: { label: "Okay", onClick: () => {} },
          });
        }
      }
    } catch (error) {
      console.error("Failed to sync cart with the database:", error);
    }
  }

  // Async function for adding the a game to a cart inside the database.
  async function addToCart(gameId: string) {
    // Post request for the url with the gameId.
    const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get the response as text for getting a error cause.
    const message = await response.text();
    // Verify if the response was not sucesfull, if it wasn't, throw an error.
    if (!response.ok) {
      throw new Error("Failed to add item to cart.", { cause: message });
    }
  }

  // Async function for removing a game from a cart inside the database.
  async function removeFromCart(gameId: string) {
    // Delete request for the url with the gameId.
    const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get the response as text for getting a error cause.
    const message = await response.text();
    // Verify if the response was not sucesfull, if it wasn't, throw an error.
    if (!response.ok) {
      throw new Error("Failed to remove item from the cart.", {
        cause: message,
      });
    }
  }

  // Async function for updating a game amount in the server.
  async function updateOnCart(gameId: string, amount: number) {
    // Delete request for the url with the gameId.
    const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
      method: "PATCH",
      body: JSON.stringify({ amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get the response as text for getting a error cause.
    const message = await response.text();
    // Verify if the response was not sucesfull, if it wasn't, throw an error.
    if (!response.ok) {
      throw new Error("Failed to update item on the cart.", {
        cause: message,
      });
    }
  }

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
