import type { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

/*
👉 Controller শুধু:
    input নেবে
    validate করবে
    service call করবে
*/
const postController = {
  createPost: async (req: Request, res: Response) => {
    try {
      const user = req?.user;
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Not valid id found",
        });
      }
      console.log("Requested user:", req.user);
      const postData = await PostService.postService(
        req.body,
        user?.id as string
      );
      return res.status(201).json(postData);
    } catch (error) {
      console.error("Error creating post:", error);
      // res.status(500).json({ message: "Internal server error" });
    }
  },
};

/*
** update version and effective  
const getController = {
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const { search, tags, isFeatured, status, authorId } = req.query;

      // 🔒 search validation
      if (search && typeof search === "string" && search.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search query too long",
        });
      }

      // 🔒 tags validation
      let tagArray: string[] = [];
      if (tags) {
        if (typeof tags !== "string") {
          return res.status(400).json({
            success: false,
            message: "Invalid tags format",
          });
        }

        tagArray = tags.split(",");
        if (tagArray.length > 5) {
          return res.status(400).json({
            success: false,
            message: "Too many tags provided",
          });
        }
      }

      // 🔒 isFeatured validation
      if (
        isFeatured &&
        isFeatured !== "true" &&
        isFeatured !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid isFeatured value",
        });
      }

      // 🔒 status validation
      if (
        status &&
        !Object.values(PostStatus).includes(status as PostStatus)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid post status",
        });
      }

      // 🔒 authorId basic safety
      if (authorId && typeof authorId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid authorId",
        });
      }

      const posts = await PostService.getAllPosts({
        search: search as string | undefined,
        tags: tagArray,
        isFeatured:
          isFeatured === "true"
            ? true
            : isFeatured === "false"
            ? false
            : undefined,
        status: status as PostStatus,
        authorId: authorId as string | undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    } catch (error) {
      console.error("GET_POSTS_ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};


*/

const getController = {
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      const searchString = typeof search === "string" ? search : undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

      const isFeatured = req.query.isFeatured
        ? req.query.isFeatured === "true"
          ? true
          : req.query.isFeatured === "false"
          ? false
          : undefined
        : undefined;
      const status = req.query.status as PostStatus;
      const authorId = req.query.authorId as string;
      // console.log({ authorId });

      // page & limit
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      console.log({ page, limit });
      // console.log({ isFeatured });

      // console.log("query search ->", searchString);
      const posts = await PostService.getAllPosts({
        search: searchString,
        tags,
        isFeatured,
        status,
        authorId,
        page,
        limit,
      });
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
