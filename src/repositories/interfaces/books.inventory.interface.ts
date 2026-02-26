import { BooksInventory } from "@prisma/client";

export interface BooksInventoryRepository {
  createBook(book: BooksInventory): Promise<BooksInventory>;
  getBookById(book_id: number): Promise<BooksInventory | null>;
  getAllBooks(page: number, limit: number): Promise<BooksInventory[]>;
  getBookByISBN(isbn: string): Promise<BooksInventory | null>;
  getBooksByTitle(title: string, page: number, limit: number): Promise<BooksInventory[]>;
  getBooksByAuthor(author: string, page: number, limit: number): Promise<BooksInventory[]>;
  getBooksByLanguage(language: string, page: number, limit: number): Promise<BooksInventory[]>;
  getBooksByGenre(genre: string, page: number, limit: number): Promise<BooksInventory[]>;
  getBooksByPublicationYear(year: string, page: number, limit: number): Promise<BooksInventory[]>;
  getBooksByAvailability(isAvailable: boolean, page: number, limit: number): Promise<BooksInventory[]>;
  updateBook(
    book_id: number,
    book: Partial<Omit<BooksInventory, "book_id" | "date_created">>,
  ): Promise<BooksInventory>;
  deleteBook(book_id: number): Promise<void>;
}
