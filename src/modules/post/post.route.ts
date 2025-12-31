import { Router } from "express";
import { PostController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middleware/auth";

const router = Router();


router.get("/", PostController.getController.getAllPosts);

router.post(
  "/addPost",
  authMiddleware(UserRole.USER),
  PostController.postController.createPost
);
router.get("/:id", PostController.getPostById);
router.delete("/:id", PostController.deletePostById);

export const postRouter = router;
