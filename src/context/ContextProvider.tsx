"use client";
import { ReactNode, createContext, useContext, useState } from "react";

// Each item of the shopping cart.
type ShoppingItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  amount: number;
};

// Initial State.
type InitialState = { shoppingCart: ShoppingItem[] };

// Type for the global context.
type GlobalContextType = {
  state: InitialState;
  addItem: (item: ShoppingItem) => boolean;
  removeItem: (itemId: string) => void;
  updateAmount: (itemId: string, amount: number) => void;
};

// Create the context.
const GlobalState = createContext<GlobalContextType>({
  state: { shoppingCart: [] },
  addItem: () => false,
  removeItem: () => {},
  updateAmount: () => {},
});

// State provider.
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InitialState>({ shoppingCart: [] });

  // Function for adding a new item to the state.
  function addItem(item: ShoppingItem) {
    // Variable to verify if the item is duplicate.
    let duplicate = false;
    setState((prevState) => {
      // Verify it the item is not in the cart yet, if it isn't, then add it.
      if (!prevState.shoppingCart.some((cur) => cur.id === item.id)) {
        return { shoppingCart: [...prevState.shoppingCart, item] };
      } else {
        // Set it as duplicate and don't change the state.
        duplicate = true;
        return prevState;
      }
    });

    //Return if it duplicate so a message can be shown.
    return duplicate;
  }

  // Function to remove a item from the shopping cart.
  function removeItem(itemId: string) {
    // Update the state by filtering the shopping cart for the item id.
    setState((prevState) => ({
      ...prevState,
      shoppingCart: prevState.shoppingCart.filter((cur) => cur.id !== itemId),
    }));
  }

  // Update the amount of a item into the shopping cart.
  function updateAmount(itemId: string, amount: number) {
    // Update the state by changing the amount of the item with the passed id.
    setState((prevState) => ({
      ...prevState,
      shoppingCart: prevState.shoppingCart.map((cur) =>
        cur.id === itemId ? { ...cur, amount: amount } : cur
      ),
    }));
  }

  return (
    <GlobalState.Provider value={{ state, addItem, removeItem, updateAmount }}>
      {children}
    </GlobalState.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalState);
}
