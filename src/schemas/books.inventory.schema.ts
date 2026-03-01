import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";

const bookSchema = {} as const;

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
} as const;

const getBookByIDSchema = {
  description: "Get a book by its ID",
  tags: ["Books Inventory"],
} as const;

const getAllBooksSchema = {
  description: "Get all books with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBookByISBNSchema = {
  description: "Get a book by its ISBN",
  tags: ["Books Inventory"],
} as const;

const getBooksByTitleSchema = {
  description: "Get books by title with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBooksByAuthorSchema = {
  description: "Get books by author with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBooksByLanguageSchema = {
  description: "Get books by language with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBooksByGenreSchema = {
  description: "Get books by genre with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBooksByPublicationYearSchema = {
  description: "Get books by publication year with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const getBooksByAvailabilitySchema = {
  description: "Get books by availability status with pagination",
  tags: ["Books Inventory"],
  querystring: paginationQuerystring,
} as const;

const updateBookSchema = {
  description: "Update a book's information",
  tags: ["Books Inventory"],
} as const;

const deleteBookSchema = {
  description: "Delete a book from the inventory",
  tags: ["Books Inventory"],
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
