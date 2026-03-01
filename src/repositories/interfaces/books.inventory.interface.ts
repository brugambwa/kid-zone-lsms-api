import { BooksInventory, book_language, book_on_offer } from "@prisma/client";

export interface BooksInventoryRepoInterface {
  createBook(book: BooksInventory): Promise<BooksInventory>;
  getBookById(book_id: number): Promise<BooksInventory | null>;
  getAllBooks(page: number, limit: number): Promise<{ data: BooksInventory[]; total: number }>;
  getBookByISBN(isbn: string): Promise<BooksInventory | null>;
  getBooksByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  getBooksByAuthor(
    author: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  getBooksByLanguage(
    language: book_language,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  getBooksByGenre(
    genre: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  getBooksByPublicationYear(
    year: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  getBooksByAvailability(
    book_on_offer: book_on_offer,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }>;
  updateBook(
    book_id: number,
    book: Partial<Omit<BooksInventory, "book_id" | "date_created">>,
  ): Promise<BooksInventory>;
  deleteBook(book_id: number): Promise<void>;
}
