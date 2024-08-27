import { CardSync, ShoppingItem } from "@/types";

// Valid actions.
type Action =
  | { type: "ADD_ITEM"; payload: ShoppingItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_AMOUNT"; payload: { gameId: string; amount: number } }
  | { type: "SYNC_CART"; payload: CardSync };

// Reducer function.
function reducer(state: ShoppingItem[], action: Action): ShoppingItem[] {
  switch (action.type) {
    // Return the current state + the passed item.
    case "ADD_ITEM":
      return [...state, action.payload];

    // Remove the item based on it's gameId.
    case "REMOVE_ITEM":
      return state.filter((item) => item.gameId !== action.payload);

    // Update the amount of the item based on it's gameId.
    case "UPDATE_AMOUNT":
      return state.map((item) =>
        item.gameId === action.payload.gameId
          ? { ...item, amount: action.payload.amount }
          : item
      );

    // Synchronize the cart with the database.
    case "SYNC_CART":
      if (action.payload.length == 0) return [];
      return action.payload.map(({ game, userId, ...item }) => ({
        ...item,
        ...game,
      }));
    default:
      return state;
  }
}
export default reducer;
