import { Router } from "express";
import { commentController } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middleware/auth";

const router = Router();
router.get(
  "/author/:authorId",
  commentController.singleCommentGetAuthor.getCommentByIdAuthor
);
router.get(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.singleCommentGet.getCommentById
);
router.patch(
  "/:commentId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.updateCommentData
);

// * admin data
router.patch(
  "/:commentId/moderate",
  authMiddleware(UserRole.ADMIN),
  commentController.moderateCommentData
);

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.commentCreate.createComment
);
export const commentRouter = router;
