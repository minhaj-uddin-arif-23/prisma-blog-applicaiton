import type { Request, Response } from "express";
import { PostService } from "./post.service";

const postController = {
  createPost: async (req: Request, res: Response) => {
    try {
      const user = req?.user
      if(!user){
        return res.status(400).json({
          success:false,
          message:'Not valid id found'
        })
      }
      console.log("Requested user:", req.user);
      const postData = await PostService.postService(req.body, user?.id as string);
      return res.status(201).json(postData);
    } catch (error) {
      console.error("Error creating post:", error);
      // res.status(500).json({ message: "Internal server error" });
    }
  },
};

const getController = {
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const {search} = req.query
      const searchString = typeof search === "string"? search  : undefined
      // if(!searchString){
      //        res.status(40).json({ message: "No valid data found" });

      // }
      console.log('query search ->', searchString)
      const posts = await PostService.getAllPosts({search: searchString});
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // res.status(500).json({ message: "Internal server error" });
    }
  },
};
// get single post by id
const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await PostService.getPostById(id as string);
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {}
};
// delete
const deletePostById = async (req: Request, res: Response) => {
  console.log("Delete request received");
  try {
    const { id } = req.params;
    const deletedPost = await PostService.deleteSinglePost(id as string);
    // if(dele)
    return res.status(201).json({
      success: true,
      post: deletedPost,
      message: "Deleted Post Successfully",
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: "Error deleting postsss",
    });
  }
};
export const PostController = {
  postController,
  getController,
  getPostById,
  deletePostById,
};
