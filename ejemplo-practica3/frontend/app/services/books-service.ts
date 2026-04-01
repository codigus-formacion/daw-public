import type BookDTO from "~/dtos/BookDTO";

const API_URL = "/api/books";

export async function getBooks(): Promise<BookDTO[]> {
  const res = await fetch(`${API_URL}/`);
  return await res.json();
}

export async function getBook(id: string): Promise<BookDTO> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Book not found");
  }
  return await res.json();
}

export async function addBook(
  title: string,
  description: string,
  shops: { id: number }[] = [],
): Promise<BookDTO> {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
      shops: shops,
    }),
  });

  if (!response.ok) {
    throw new Error("Error adding book");
  }

  return await response.json();
}

export async function removeBook(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error removing book");
  }
}

export async function updateBook(
  id: string,
  title: string,
  description: string,
  shops: { id: number }[] = [],
): Promise<BookDTO> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, shops }),
  });

  if (!response.ok) {
    throw new Error("Error updating book");
  }

  return await response.json();
}