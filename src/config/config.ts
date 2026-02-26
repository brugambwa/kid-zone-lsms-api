import { envPrefix } from "./constants";

interface DbEnv {
  connectionString: string;
}

const createDbConfig = (envPrefix: string): DbEnv => {
  const dialect = process.env[`${envPrefix}_DB_DIALECT`] || "postgresql";
  const host = process.env[`${envPrefix}_DB_HOST`] || "";
  const port = process.env[`${envPrefix}_DB_PORT`] || "5432";
  const user = process.env[`${envPrefix}_DB_USER`] || "";
  const password = process.env[`${envPrefix}_DB_PASS`] || "";
  const database = process.env[`${envPrefix}_DB_NAME`] || "";
  const connectionString = `${dialect}://${user}:${password}@${host}:${port}/${database}`;
  process.env.DATABASE_URL = connectionString;
  return { connectionString };
};

export const dbConfig = {
  dbConnString: createDbConfig(envPrefix).connectionString,
};
