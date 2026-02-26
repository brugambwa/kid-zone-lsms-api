import { PrismaClient } from "@prisma/client";
import { dbConfig } from "./config";

const APP_ENV = process.env.APP_ENV || "development";

/**
 * Prisma client for database connection
 */
export const prismaDBConn = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.dbConnString, // primary / master DB
    },
  },
});

/**
 * Verify DB connection
 */
export const verifyDbConnections = async () => {
  try {
    await prismaDBConn.$connect();
    console.log("DB connection established successfully on", APP_ENV);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

/**
 * Graceful shutdown (close DB connection)
 */
export const closeDbConnections = async () => {
  try {
    await prismaDBConn.$disconnect();
    console.log("Database connection closed cleanly.");
  } catch (err) {
    console.error("Error during DB disconnection:", err);
  }
};
