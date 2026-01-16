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
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCode = 400), (errorMessage = "Missing filed or filed types");
  }

  res.status(statusCode);

  res.json({
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
