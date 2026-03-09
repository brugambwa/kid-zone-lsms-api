import { config } from "dotenv";
import { cleanEnv, str, port, num } from "envalid";
config({ quiet: true });

const appEnv = process.env.APP_ENV?.toLowerCase() || "development";
export const envMap: Record<string, string> = {
  development: "DEV",
  qa: "QA",
  uat: "UAT",
  production: "PDN",
  test: "DEV",
};

export const envPrefix = envMap[appEnv] || "DEV";

const envConfigs = {
  PDN: {
    // Database configurations
    PDN_DB_DIALECT: str({ default: "mysql" }),
    PDN_DB_HOST: str(),
    PDN_DB_PORT: port({ default: 3306 }),
    PDN_DB_USER: str(),
    PDN_DB_PASS: str(),
    PDN_DB_NAME: str(),
  },
  UAT: {
    // Database configurations
    UAT_DB_DIALECT: str({ default: "postgresql" }),
    UAT_DB_HOST: str(),
    UAT_DB_PORT: port({ default: 5432 }),
    UAT_DB_USER: str(),
    UAT_DB_PASS: str(),
    UAT_DB_NAME: str(),
  },
  DEV: {
    // Database configurations
    DEV_DB_DIALECT: str({ default: "postgresql" }),
    DEV_DB_HOST: str(),
    DEV_DB_PORT: port({ default: 5432 }),
    DEV_DB_USER: str(),
    DEV_DB_PASS: str(),
    DEV_DB_NAME: str(),
  },
};

export const env = cleanEnv(process.env, {
  APP_ENV: str({
    choices: ["development", "qa", "uat", "production", "test"],
    default: "development",
  }),
  APP_PORT: port({ default: 3001 }),
  LOG_LEVEL: str({ default: "info" }),
  CONNECTION_TIMEOUT: str({ default: "30000" }),
  KEEPALIVE_TIMEOUT: str({ default: "72000" }),
  BODY_LIMIT: str({ default: "1048576" }), // 1MB
  SYSTEM_MEMBER_ID: num({ default: 0 }),
  SYSTEM_MEMBER_PROFILE_ID: num({ default: 0 }),
  SYSTEM_LINKED_MSISDN: str({ default: "250788000000" }),
  // Auth & Google OAuth configuration
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: "1d" }),
  GOOGLE_CLIENT_ID: str({ default: "" }),
  GOOGLE_CLIENT_SECRET: str({ default: "" }),
  GOOGLE_REDIRECT_URI: str({ default: "" }),
  // SMTP / email configuration
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),
  SMTP_FROM: str({ default: "" }),
  ...(envConfigs[envPrefix as keyof typeof envConfigs] || envConfigs.DEV),
});

// Export constants
export const APP_ENV = env.APP_ENV;
export const PORT = env.APP_PORT;
export const LOG_LEVEL = env.LOG_LEVEL;
export const CONNECTION_TIMEOUT = env.CONNECTION_TIMEOUT;
export const KEEPALIVE_TIMEOUT = env.KEEPALIVE_TIMEOUT;
export const BODY_LIMIT = env.BODY_LIMIT;
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = env.GOOGLE_REDIRECT_URI;

export const SMTP_HOST = env.SMTP_HOST;
export const SMTP_PORT = env.SMTP_PORT;
export const SMTP_USER = env.SMTP_USER;
export const SMTP_PASS = env.SMTP_PASS;
export const SMTP_FROM = env.SMTP_FROM;


