import { Router } from "express";
import { PostController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/", PostController.getController.getAllPosts);

router.post(
  "/addPost",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.postController.createPost
);
router.get("/:id", PostController.getPostById);
router.delete("/:id", PostController.deletePostById);

// fetch my post
router.get(
  "/my-post",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPost
);
// * update each user post
router.patch(
  "/:postId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost
);

export const postRouter = router;
