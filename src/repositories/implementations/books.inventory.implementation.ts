import { BooksInventory, Prisma, book_language, book_on_offer } from "@prisma/client";
import { BooksInventoryRepoInterface } from "../interfaces/books.inventory.interface";
import { prismaDBConn } from "../../config/prisma";

export class BooksInventoryRepoImplementation implements BooksInventoryRepoInterface {
  async createBook(book: Prisma.BooksInventoryCreateInput): Promise<BooksInventory> {
    return await prismaDBConn.booksInventory.create({ data: book });
  }

  async getBookById(book_id: number): Promise<BooksInventory | null> {
    return await prismaDBConn.booksInventory.findUnique({ where: { book_id } });
  }

  async getAllBooks(page: number, limit: number): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({ skip, take: limit }),
      prismaDBConn.booksInventory.count(),
    ]);
    return { data, total };
  }

  async getBookByISBN(book_isbn: string): Promise<BooksInventory | null> {
    return await prismaDBConn.booksInventory.findUnique({ where: { book_isbn } });
  }

  async getBooksByTitle(
    book_title: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_title: { contains: book_title } },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_title: { contains: book_title } },
      }),
    ]);
    return { data, total };
  }

  async getBooksByAuthor(
    book_author: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_author: { contains: book_author } },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_author: { contains: book_author } },
      }),
    ]);
    return { data, total };
  }

  async getBooksByLanguage(
    book_language: book_language,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_language },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_language },
      }),
    ]);
    return { data, total };
  }

  async getBooksByGenre(
    book_genre: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_genre: { contains: book_genre } },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_genre: { contains: book_genre } },
      }),
    ]);
    return { data, total };
  }

  async getBooksByPublicationYear(
    book_publication_year: string,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_publication_year },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_publication_year },
      }),
    ]);
    return { data, total };
  }

  async getBooksByAvailability(
    book_on_offer: book_on_offer,
    page: number,
    limit: number,
  ): Promise<{ data: BooksInventory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.booksInventory.findMany({
        where: { book_on_offer, no_of_copies: { gt: 0 } },
        skip,
        take: limit,
      }),
      prismaDBConn.booksInventory.count({
        where: { book_on_offer, no_of_copies: { gt: 0 } },
      }),
    ]);
    return { data, total };
  }

  async updateBook(book_id: number, book: Prisma.BooksInventoryUpdateInput): Promise<BooksInventory> {
    return await prismaDBConn.booksInventory.update({
      where: { book_id },
      data: book,
    });
  }

  async deleteBook(book_id: number): Promise<void> {
    await prismaDBConn.booksInventory.delete({ where: { book_id } });
  }
}
