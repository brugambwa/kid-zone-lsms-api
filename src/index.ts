import { config } from "dotenv";
import { createApp } from "./app";
import { APP_ENV, PORT } from "./config/constants";

// Load environment variables first
config();

export let server: Awaited<ReturnType<typeof createApp>>;

const start = async (): Promise<void> => {
  try {
    // Create and initialize the app
    server = await createApp();

    // Start listening
    await server.listen({
      port: PORT,
      host: "0.0.0.0", // Important for containerized deployments
    });

    server.log.info(
      `KidZone Library Management System API is running on port ${PORT} in ${APP_ENV || "development"} mode`,
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\nReceived ${signal}, starting graceful shutdown...`);

  if (server) {
    try {
      // Stop accepting new connections
      await server.close();
      console.log("Server closed successfully");

      // Give active connections time to complete (important for K8s)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  } else {
    process.exit(0);
  }
};

// Register shutdown handlers (important for K8s graceful termination)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors (last resort)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  start();
}
