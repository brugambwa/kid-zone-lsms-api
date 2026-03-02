import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";
import { book_language, book_on_offer } from "@prisma/client";

const bookSchema = {
  type: "object",
  properties: {
    date_created: { type: "string", format: "date-time" },
    book_id: { type: "number" },
    book_isbn: { type: "string", maxLength: 255 },
    book_title: { type: "string", maxLength: 255 },
    book_author: { type: "string", maxLength: 255 },
    description: { type: "string", nullable: true },
    book_language: { type: "string", enum: Object.values(book_language) },
    book_genre: { type: "string", maxLength: 255, nullable: true },
    collection: { type: "string", maxLength: 255 },
    book_publication_year: { type: "string", maxLength: 4, nullable: true },
    book_length: { type: "integer" },
    no_of_copies: { type: "integer" },
    book_on_offer: { type: "string", enum: Object.values(book_on_offer) },
    last_update_by: { type: "string", maxLength: 255, nullable: true },
    last_update_to: { type: "string", maxLength: 255, nullable: true },
    last_update_at: { type: "string", format: "date-time", nullable: true },
  },
} as const;

//Reusable Response Schemas
const successResponseSingle = {
  type: "object",
  properties: {
    ...baseResponse,
    data: bookSchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        bookSchema,
        { type: "array", items: bookSchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

// Route Validation Schemas.
const createBookSchema = {
  description: "Create a new book in the inventory",
  tags: ["Books Inventory"],
  body: {
    type: "object",
    required: [
      "book_isbn",
      "book_title",
      "book_author",
      "book_language",
      "collection",
      "book_length",
      "no_of_copies",
      "book_on_offer",
    ],
    properties: {
      book_isbn: bookSchema.properties.book_isbn,
      book_title: bookSchema.properties.book_title,
      book_author: bookSchema.properties.book_author,
      description: bookSchema.properties.description,
      book_language: bookSchema.properties.book_language,
      book_genre: bookSchema.properties.book_genre,
      collection: bookSchema.properties.collection,
      book_publication_year: bookSchema.properties.book_publication_year,
      book_length: bookSchema.properties.book_length,
      no_of_copies: bookSchema.properties.no_of_copies,
      book_on_offer: bookSchema.properties.book_on_offer,
    },
    additionalProperties: false,
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
  },
} as const;

const getBookByIDSchema = {
  description: "Get a book by its ID",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["book_id"],
    properties: {
      book_id: bookSchema.properties.book_id,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
  },
} as const;

const getAllBooksSchema = {
  description: "Get all books with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBookByISBNSchema = {
  description: "Get a book by its ISBN",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["book_isbn"],
    properties: {
      book_isbn: bookSchema.properties.book_isbn,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
  },
} as const;

const getBooksByTitleSchema = {
  description: "Get books by title with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["title"],
    properties: {
      title: bookSchema.properties.book_title,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBooksByAuthorSchema = {
  description: "Get books by author with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["author"],
    properties: {
      author: bookSchema.properties.book_author,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBooksByLanguageSchema = {
  description: "Get books by language with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["language"],
    properties: {
      language: bookSchema.properties.book_language,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBooksByGenreSchema = {
  description: "Get books by genre with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["genre"],
    properties: {
      genre: bookSchema.properties.book_genre,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBooksByPublicationYearSchema = {
  description: "Get books by publication year with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["publication_year"],
    properties: {
      publication_year: bookSchema.properties.book_publication_year,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getBooksByAvailabilitySchema = {
  description: "Get books by availability status with pagination",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["book_on_offer"],
    properties: {
      book_on_offer: bookSchema.properties.book_on_offer,
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const updateBookSchema = {
  description: "Update a book's information",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["book_id"],
    properties: {
      book_id: bookSchema.properties.book_id,
    },
  },
  body: {
    type: "object",
    properties: {
      book_isbn: bookSchema.properties.book_isbn,
      book_title: bookSchema.properties.book_title,
      book_author: bookSchema.properties.book_author,
      description: bookSchema.properties.description,
      book_language: bookSchema.properties.book_language,
      book_genre: bookSchema.properties.book_genre,
      collection: bookSchema.properties.collection,
      book_publication_year: bookSchema.properties.book_publication_year,
      book_length: bookSchema.properties.book_length,
      no_of_copies: bookSchema.properties.no_of_copies,
      book_on_offer: bookSchema.properties.book_on_offer,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
  },
} as const;

const deleteBookSchema = {
  description: "Delete a book from the inventory",
  tags: ["Books Inventory"],
  params: {
    type: "object",
    required: ["book_id"],
    properties: {
      book_id: bookSchema.properties.book_id,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
  },
} as const;

export const booksInventorySchemas = {
  createBook: createBookSchema,
  getBookByID: getBookByIDSchema,
  getAllBooks: getAllBooksSchema,
  getBookByISBN: getBookByISBNSchema,
  getBooksByTitle: getBooksByTitleSchema,
  getBooksByAuthor: getBooksByAuthorSchema,
  getBooksByLanguage: getBooksByLanguageSchema,
  getBooksByGenre: getBooksByGenreSchema,
  getBooksByPublicationYear: getBooksByPublicationYearSchema,
  getBooksByAvailability: getBooksByAvailabilitySchema,
  updateBook: updateBookSchema,
  deleteBook: deleteBookSchema,
};
