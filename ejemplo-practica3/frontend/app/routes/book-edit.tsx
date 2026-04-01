import { useNavigate } from "react-router";
import { useActionState } from "react";
import type { Route } from "./+types/book-edit";
import BookForm from "~/components/book-form";
import { getBook, updateBook } from "~/services/books-service";
import { getShops } from "~/services/shops-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [book, shops] = await Promise.all([getBook(params.id!), getShops()]);
  return { book, shops };
}

export default function BookEdit({ loaderData }: Route.ComponentProps) {
  const { book, shops } = loaderData;
  const navigate = useNavigate();

  async function saveBookAction(
    prevState: { success?: boolean; error?: string | null } | null,
    formData: FormData,
  ) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const shops = formData.getAll("shops").map((id) => ({ id: Number(id) }));

    try {
      await updateBook(id, title, description, shops);
      navigate(`/book/${book.id}`);
      return { success: true, error: null };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to update book. Please try again.",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(saveBookAction, null);

  return (
    <BookForm
      book={book}
      shops={shops}
      actionState={[state, formAction, isPending]}
      onCancel={() => navigate(-1)}
    />
  );
}
