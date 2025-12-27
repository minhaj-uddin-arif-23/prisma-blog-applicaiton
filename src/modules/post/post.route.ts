import { Router } from "express";
import { PostController } from "./post.controller";
const router = Router();

router.post("/addPost", PostController.postController.createPost);
router.get("/", PostController.getController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.delete("/:id", PostController.deletePostById);

export const postRouter = router;
