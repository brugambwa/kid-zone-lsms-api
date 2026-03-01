import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma, book_on_offer, book_language } from "@prisma/client";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { BooksInventoryService } from "../services/books.inventory.service";

export class BooksInventoryController {
  private readonly booksInventoryService: BooksInventoryService;

  constructor() {
    this.booksInventoryService = new BooksInventoryService();
  }

  async createBook(req: FastifyRequest, res: FastifyReply) {
    const {
      book_title,
      book_author,
      book_isbn,
      book_language,
      book_genre,
      book_publication_year,
      description,
      collection,
      book_length,
      no_of_copies,
      book_on_offer,
    } = req.body as {
      book_title: string;
      book_author: string;
      book_isbn: string;
      book_language: book_language;
      book_genre: string;
      book_publication_year: string;
      description?: string;
      collection: string;
      book_length: number;
      no_of_copies: number;
      book_on_offer: book_on_offer;
    };

    const bookInfoObj = {
      book_title,
      book_author,
      book_isbn,
      book_language,
      book_genre,
      book_publication_year,
      description,
      collection,
      book_length,
      no_of_copies,
      book_on_offer,
    } as Prisma.BooksInventoryCreateInput;

    const newBook = await this.booksInventoryService.createBook(bookInfoObj);

    logger.info(`Book created successfully with ID ${newBook.book_id}.`);
    return ResponseHandler.success(res, newBook, 100, "Book created successfully.", 201);
  }

  async getBookById(req: FastifyRequest, res: FastifyReply) {
    const { book_id } = req.params as { book_id: number };
    const book = await this.booksInventoryService.getBookById(book_id);
    if (!book) {
      logger.warn(`Book with ID ${book_id} not found.`);
      return ResponseHandler.error(res, `Book with ID ${book_id} not found.`, 101, 200);
    }
    logger.info(`Book with ID ${book_id} retrieved successfully.`);
    return ResponseHandler.success(res, book, 100, "Book retrieved successfully.");
  }

  async getAllBooks(request: FastifyRequest, reply: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.booksInventoryService.getAllBooks(page, limit),
      {
        notFound: "No book records found.",
        notFoundLog: "No book records found.",
        success: "Book records retrieved successfully.",
        successLog: "Book records retrieved successfully.",
      },
    );
  }

  async getBookByISBN(req: FastifyRequest, res: FastifyReply) {
    const { book_isbn } = req.params as { book_isbn: string };
    const book = await this.booksInventoryService.getBookByISBN(book_isbn);
    if (!book) {
      logger.warn(`Book with ISBN ${book_isbn} not found.`);
      return ResponseHandler.error(res, `Book with ISBN ${book_isbn} not found.`, 101, 200);
    }
    logger.info(`Book with ISBN ${book_isbn} retrieved successfully.`);
    return ResponseHandler.success(res, book, 100, "Book retrieved successfully.");
  }

  async getBooksByTitle(request: FastifyRequest, reply: FastifyReply) {
    const { title } = request.params as { title: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.booksInventoryService.getBooksByTitle(title, page, limit),
      {
        notFound: `No books found with title containing "${title}".`,
        notFoundLog: `No books found with title containing "${title}".`,
        success: `Books with title containing "${title}" retrieved successfully.`,
        successLog: `Books with title containing "${title}" retrieved successfully.`,
      },
    );
  }

  async getBooksByAuthor(request: FastifyRequest, reply: FastifyReply) {
    const { author } = request.params as { author: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.booksInventoryService.getBooksByAuthor(author, page, limit),
      {
        notFound: `No books found with author containing "${author}".`,
        notFoundLog: `No books found with author containing "${author}".`,
        success: `Books with author containing "${author}" retrieved successfully.`,
        successLog: `Books with author containing "${author}" retrieved successfully.`,
      },
    );
  }

  async getBooksByLanguage(request: FastifyRequest, reply: FastifyReply) {
    const { language } = request.params as { language: book_language };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.booksInventoryService.getBooksByLanguage(language, page, limit),
      {
        notFound: `No books found with language "${language}".`,
        notFoundLog: `No books found with language "${language}".`,
        success: `Books with language "${language}" retrieved successfully.`,
        successLog: `Books with language "${language}" retrieved successfully.`,
      },
    );
  }

  async getBooksByGenre(request: FastifyRequest, reply: FastifyReply) {
    const { genre } = request.params as { genre: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.booksInventoryService.getBooksByGenre(genre, page, limit),
      {
        notFound: `No books found with genre "${genre}".`,
        notFoundLog: `No books found with genre "${genre}".`,
        success: `Books with genre "${genre}" retrieved successfully.`,
        successLog: `Books with genre "${genre}" retrieved successfully.`,
      },
    );
  }

  async getBooksByPublicationYear(request: FastifyRequest, reply: FastifyReply) {
    const { year } = request.params as { year: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) =>
        this.booksInventoryService.getBooksByPublicationYear(year, page, limit),
      {
        notFound: `No books found published in year "${year}".`,
        notFoundLog: `No books found published in year "${year}".`,
        success: `Books published in year "${year}" retrieved successfully.`,
        successLog: `Books published in year "${year}" retrieved successfully.`,
      },
    );
  }

  async getBooksByAvailability(request: FastifyRequest, reply: FastifyReply) {
    const { availability } = request.params as { availability: book_on_offer };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) =>
        this.booksInventoryService.getBooksByAvailability(availability, page, limit),
      {
        notFound: `No books found with availability status "${availability}".`,
        notFoundLog: `No books found with availability status "${availability}".`,
        success: `Books with availability status "${availability}" retrieved successfully.`,
        successLog: `Books with availability status "${availability}" retrieved successfully.`,
      },
    );
  }

  async updateBook(req: FastifyRequest, res: FastifyReply) {
    const { book_id } = req.params as { book_id: number };
    const {
      book_title,
      book_author,
      book_isbn,
      book_language,
      book_genre,
      book_publication_year,
      description,
      collection,
      book_length,
      no_of_copies,
      book_on_offer,
    } = req.body as {
      book_title?: string;
      book_author?: string;
      book_isbn?: string;
      book_language?: book_language;
      book_genre?: string;
      book_publication_year?: string;
      description?: string;
      collection?: string;
      book_length?: number;
      no_of_copies?: number;
      book_on_offer?: book_on_offer;
    };

    const updateData: Prisma.BooksInventoryUpdateInput = {
      ...(book_title && { book_title }),
      ...(book_author && { book_author }),
      ...(book_isbn && { book_isbn }),
      ...(book_language && { book_language }),
      ...(book_genre && { book_genre }),
      ...(book_publication_year && { book_publication_year }),
      ...(description && { description }),
      ...(collection && { collection }),
      ...(book_length !== undefined && { book_length }),
      ...(no_of_copies !== undefined && { no_of_copies }),
      ...(book_on_offer !== undefined && { book_on_offer }),
    };

    const updatedBook = await this.booksInventoryService.updateBook(book_id, updateData);
    if (!updatedBook) {
      logger.warn(`Book with ID ${book_id} not found for update.`);
      return ResponseHandler.error(res, `Book with ID ${book_id} not found.`, 101, 200);
    }
    logger.info(`Book with ID ${book_id} updated successfully.`);
    return ResponseHandler.success(res, updatedBook, 100, "Book updated successfully.");
  }

  async deleteBook(req: FastifyRequest, res: FastifyReply) {
    const { book_id } = req.params as { book_id: number };
    await this.booksInventoryService.deleteBook(book_id);
    logger.info(`Book with ID ${book_id} deleted successfully.`);
    return ResponseHandler.success(res, null, 100, "Book deleted successfully.");
  }
}
