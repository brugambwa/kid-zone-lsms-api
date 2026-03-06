import path from "node:path";
import { config } from "dotenv";

// Prisma skips .env loading when prisma.config.ts is present, so we load it manually.
config({ path: path.join(__dirname, ".env") });

export default {
  schema: path.join("src/model"),
};