import { Router } from "express";
import { commentController } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middleware/auth";

const router = Router();
router.get(
  "/author/:authorId",
  commentController.singleCommentGetAuthor.getCommentByIdAuthor
);
router.get("/:id", commentController.singleCommentGet.getCommentById);
router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.commentCreate.createComment
);
export const commentRouter = router;
