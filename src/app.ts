import fastify, { FastifyInstance } from "fastify";
import { config } from "dotenv";
import { LOG_LEVEL, APP_ENV, CONNECTION_TIMEOUT, KEEPALIVE_TIMEOUT, BODY_LIMIT } from "./config/constants";
import corsPlugin from "./plugins/cors";
import swaggerPlugin from "./plugins/swagger";
import { verifyDbConnections } from "./config/prisma";
import { kidzoneLMSRoutes } from "./routes/index";

config();

export const createApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      level: LOG_LEVEL || "info",
      ...(APP_ENV === "production" && {
        // Production logging configuration
        serializers: {
          req(req: any) {
            return {
              method: req.method,
              url: req.url,
              headers: req.headers,
              hostname: req.hostname,
              remoteAddress: req.ip,
              remotePort: req.socket.remotePort,
            };
          },
          res(res: any) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      }),
    },
    requestIdLogLabel: "reqId",
    disableRequestLogging: APP_ENV === "production", // Disable auto-logging in production
    trustProxy: true, // Important for K8s deployments
    ajv: {
      customOptions: {
        strict: false,
        removeAdditional: false, // Keep for explicit validation
        coerceTypes: false, // Strict type checking
        useDefaults: true,
        allErrors: true,
      },
    },
    // Connection timeouts for high-throughput systems
    connectionTimeout: Number.parseInt(CONNECTION_TIMEOUT || "30000"),
    keepAliveTimeout: Number.parseInt(KEEPALIVE_TIMEOUT || "72000"),
    // Body size limits
    bodyLimit: Number.parseInt(BODY_LIMIT || "1048576"), // 1MB default
  });

  // Verify database connections before registering routes
  try {
    await verifyDbConnections();

    app.log.info("Database connections verified successfully");
  } catch (error) {
    app.log.error({ err: error }, "Failed to verify database connections");
    throw error;
  }

  // Register plugins
  await app.register(corsPlugin);
  await app.register(swaggerPlugin);

  // Register routes
  await app.register(kidzoneLMSRoutes);

  // Health check endpoint (important for K8s probes)
  app.get("/health", async (request, reply) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Readiness probe (checks database connectivity)
  app.get("/ready", async (request, reply) => {
    try {
      await verifyDbConnections();
      return {
        status: "ready",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Properly handle the error by logging it
      app.log.error(
        {
          err: error,
          reqId: request.id,
        },
        "Database readiness check failed",
      );

      reply.code(503);
      return {
        status: "not ready",
        error: "Database connection failed",
        timestamp: new Date().toISOString(),
      };
    }
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(
      {
        err: error,
        reqId: request.id,
        url: request.url,
        method: request.method,
      },
      "Request error",
    );

    const statusCode = (error as any).statusCode || 500;
    const message = (error as any).message || "Internal Server Error";
    const stack = (error as any).stack;

    // Don't leak internal errors in production
    if (APP_ENV === "production") {
      reply.code(statusCode).send({
        success: false,
        resp_code: statusCode,
        resp_msg: statusCode === 400 ? message : "Internal Server Error",
      });
    } else {
      reply.code(statusCode).send({
        success: false,
        resp_code: statusCode,
        resp_msg: message,
        stack: stack,
      });
    }
  });

  return app;
};
