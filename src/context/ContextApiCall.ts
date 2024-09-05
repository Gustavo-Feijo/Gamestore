import { CardSync } from "@/types";

// Async function for adding the a game to a cart inside the database.
export async function addToCart(gameId: string) {
  // Post request for the url with the gameId.
  const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get the response as text for getting a error cause.
  const data = await response.json();
  // Verify if the response was not sucesfull, if it wasn't, throw an error.
  if (!response.ok) {
    throw new Error("Failed to add item to cart.", { cause: data.message });
  }
}

// Async function for removing a game from a cart inside the database.
export async function removeFromCart(gameId: string) {
  // Delete request for the url with the gameId.
  const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get the response as text for getting a error cause.
  const data = await response.json();
  // Verify if the response was not sucesfull, if it wasn't, throw an error.
  if (!response.ok) {
    throw new Error("Failed to remove item from the cart.", {
      cause: data.message,
    });
  }
}

// Async function for updating a game amount in the server.
export async function updateOnCart(gameId: string, amount: number) {
  // Delete request for the url with the gameId.
  const response = await fetch(`/api/cart/${encodeURIComponent(gameId)}`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get the response as text for getting a error cause.
  const data = await response.json();
  // Verify if the response was not sucesfull, if it wasn't, throw an error.
  if (!response.ok) {
    throw new Error("Failed to update item on the cart.", {
      cause: data.message,
    });
  }
}

// Async function for getting the latest saved cart in the server.
export async function getCart(): Promise<CardSync> {
  const response = await fetch("/api/cart");

  if (!response.ok) {
    const data = await response.json();
    throw new Error("Could not fetch the cart.", { cause: data.message });
  }

  const data: { result: CardSync } = await response.json();
  return data.result;
}
