import { Router } from "express";
import { commentController } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middleware/auth";

const router = Router();
router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.commentCreate.createComment
);
export const commentRouter = router;
