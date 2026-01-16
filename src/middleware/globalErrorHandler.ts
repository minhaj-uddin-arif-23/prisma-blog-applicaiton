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
  let errorMessage = "Internal server error";
  let errorDetails: any = undefined;

  /* ---------- Prisma Validation Error ---------- */
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid request data (missing field or wrong type)";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {

  /* ---------- Prisma Known Request Errors (with codes) ---------- */
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage = "Duplicate value already exists";
        break;

      case "P2025":
        statusCode = 404;
        errorMessage = "Record not found";
        break;

      case "P2003":
        statusCode = 400;
        errorMessage = "Foreign key constraint failed";
        break;

      case "P2024":
        statusCode = 503;
        errorMessage = "Database connection timeout";
        break;

      default:
        statusCode = 400;
        errorMessage = "Database request error";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {

  /* ---------- Prisma DB Connection Error ---------- */
    statusCode = 503;
    errorMessage = "Database connection failed";
  } else if (err.statusCode && err.message) {

  /* ---------- Custom App Errors ---------- */
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  /* ---------- Development Only Error Details ---------- */
  if (process.env.NODE_ENV !== "production") {
    errorDetails = err;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;

/**
 import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

// Global Error Handler Middleware
function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If response already sent, delegate to default handler
  if (res.headersSent) {
    return next(err);
  }

  // Default error values (fallback)
  let statusCode = 500;
  let message = "Internal server error";
  let error: any = undefined;

  /* ---------------- Prisma Errors ---------------- */

// Prisma validation error (missing field / wrong type)
//   if (err instanceof Prisma.PrismaClientValidationError) {
//     statusCode = 400;
//     message = "Invalid request data";
//   }

// Prisma known request error (unique, foreign key, etc.)
//   else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     statusCode = 400;

//     if (err.code === "P2002") {
//       message = "Duplicate value. This data already exists.";
//     } else if (err.code === "P2025") {
//       message = "Requested resource not found.";
//       statusCode = 404;
//     } else {
//       message = "Database request error";
//     }
//   }

/* ---------------- Custom / App Errors ---------------- */

// Custom thrown error with statusCode
//   else if (err.statusCode) {
//     statusCode = err.statusCode;
//     message = err.message;
//   }

/* ---------------- Development Only ---------------- */

// Show full error only in development
//   if (process.env.NODE_ENV !== "production") {
//     error = err;
//   }

// Final response
//   res.status(statusCode).json({
//     success: false,
//     message,
//     error,
//   });
// }

// export default errorHandler;

//  */
