import { Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "You have reached to wrong place. API not found",
    path: req.originalUrl,
    requestedAt: new Date().toISOString(),
  });
}
