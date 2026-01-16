import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Internal server error";
  let error: any = undefined;

  /* ---------- Prisma Validation Error ---------- */
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid request data (missing field or wrong type)";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    /* ---------- Prisma Known Request Error (P2000–P2031) ---------- */
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate value already exists";
        break;

      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;

      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;

      case "P2024":
        statusCode = 503;
        message = "Database connection timeout";
        break;

      default:
        statusCode = 400;
        message = "Database request error";
    }
    /* ---------- Prisma Unknown Request Error ---------- */
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown database error occurred";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    /* ---------- Prisma Initialization Error ---------- */
    statusCode = 503;
    message = "Database initialization failed";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    /* ---------- Prisma Rust Panic Error ---------- */
    statusCode = 500;
    message = "Database engine crashed";
  } else if (err.statusCode && err.message) {
    /* ---------- Custom App Errors ---------- */
    statusCode = err.statusCode;
    message = err.message;
  }

  /* ---------- Development Only ---------- */
  if (process.env.NODE_ENV !== "production") {
    error = err;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}

export default errorHandler;
