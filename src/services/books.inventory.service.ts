import { BooksInventory, Prisma, book_language, book_on_offer } from "@prisma/client";
import { BooksInventoryRepoImplementation } from "../repositories/implementations/books.inventory.implementation";

export class BooksInventoryService {
  private readonly booksInventoryRepo: BooksInventoryRepoImplementation;

  constructor() {
    this.booksInventoryRepo = new BooksInventoryRepoImplementation();
  }

  async createBook(book: Prisma.BooksInventoryCreateInput): Promise<BooksInventory> {
    return await this.booksInventoryRepo.createBook(book);
  }

  async getBookById(book_id: number): Promise<BooksInventory | null> {
    return await this.booksInventoryRepo.getBookById(book_id);
  }

  async getAllBooks(page: number, limit: number): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getAllBooks(page, limit);
  }

  async getBookByISBN(isbn: string): Promise<BooksInventory | null> {
    return await this.booksInventoryRepo.getBookByISBN(isbn);
  }

  async getBooksByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByTitle(title, page, limit);
  }

  async getBooksByAuthor(
    author: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByAuthor(author, page, limit);
  }

  async getBooksByLanguage(
    language: book_language,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByLanguage(language, page, limit);
  }

  async getBooksByGenre(
    genre: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByGenre(genre, page, limit);
  }

  async getBooksByPublicationYear(
    year: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByPublicationYear(year, page, limit);
  }

  async getBooksByAvailability(
    availability: book_on_offer,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    return await this.booksInventoryRepo.getBooksByAvailability(availability, page, limit);
  }

  async updateBook(book_id: number, book: Prisma.BooksInventoryUpdateInput): Promise<BooksInventory> {
    return await this.booksInventoryRepo.updateBook(book_id, book);
  }

  async deleteBook(book_id: number): Promise<void> {
    await this.booksInventoryRepo.deleteBook(book_id);
  }
}
