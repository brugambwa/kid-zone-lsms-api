import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { BooksInventoryController } from "../controllers/books.inventory.controller";
import { booksInventorySchemas } from "../schemas/books.inventory.schema";

export async function booksInventoryRoutes(fastify: FastifyInstance) {
  const booksInventoryController = new BooksInventoryController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/",
    { schema: booksInventorySchemas.createBook },
    asyncWrapper(booksInventoryController.createBook.bind(booksInventoryController)),
  );
  fastify.get(
    "/:book_id",
    { schema: booksInventorySchemas.getBookByID, preHandler: [parseIntParam("book_id")] },
    asyncWrapper(booksInventoryController.getBookById.bind(booksInventoryController)),
  );
  fastify.get(
    "/",
    { schema: booksInventorySchemas.getAllBooks },
    asyncWrapper(booksInventoryController.getAllBooks.bind(booksInventoryController)),
  );
  fastify.get(
    "/language/:language",
    { schema: booksInventorySchemas.getBooksByLanguage },
    asyncWrapper(booksInventoryController.getBooksByLanguage.bind(booksInventoryController)),
  );
  fastify.get(
    "/genre/:genre",
    { schema: booksInventorySchemas.getBooksByGenre },
    asyncWrapper(booksInventoryController.getBooksByGenre.bind(booksInventoryController)),
  );
  fastify.get(
    "/publication-year/:year",
    { schema: booksInventorySchemas.getBooksByPublicationYear },
    asyncWrapper(booksInventoryController.getBooksByPublicationYear.bind(booksInventoryController)),
  );
  fastify.get(
    "/availability/:book_on_offer",
    { schema: booksInventorySchemas.getBooksByAvailability },
    asyncWrapper(booksInventoryController.getBooksByAvailability.bind(booksInventoryController)),
  );

  fastify.put(
    "/:book_id",
    { schema: booksInventorySchemas.updateBook, preHandler: [parseIntParam("book_id")] },
    asyncWrapper(booksInventoryController.updateBook.bind(booksInventoryController)),
  );
  fastify.delete(
    "/:book_id",
    { schema: booksInventorySchemas.deleteBook, preHandler: [parseIntParam("book_id")] },
    asyncWrapper(booksInventoryController.deleteBook.bind(booksInventoryController)),
  );
}
