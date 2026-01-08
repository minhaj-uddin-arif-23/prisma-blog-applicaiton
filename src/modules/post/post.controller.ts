import { SortOrder } from "./../../../generated/prisma/internal/prismaNamespaceBrowser";
import type { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

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

      // console.log({ sortBy, sortOrder });
      const { page, limit, sortBy, sortOrder } = paginationSortingHelper(
        req.query
      );
      // console.log({ page, limit, sortBy, sortOrder });
      // console.log({ page, limit });
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
        sortBy,
        sortOrder,
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
  try {
    // console.log("get id ");
    const { id } = req.params;
    if (!id) {
      throw new Error("ID NOT FOUND");
    }
    const post = await PostService.getPostById(id as string);

    return res.status(200).json(post);
  } catch (error) {}
};
// * update user post data
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    // console.log({ user });
    const { postId } = req.params;
    const isAdmin = user?.role === UserRole.ADMIN;
    const data = await PostService.updatePostData(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin
    );
    return res.status(200).json({ data });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "comment updated failed";
    res.status(400).json({ message: errorMessage });
    return res.status(404).json({
      success: false,
      message: errorMessage,
    });
  }
};
// delete
const deletePostById = async (req: Request, res: Response) => {
  // console.log("Delete request received");
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

//TODO -> PROBLEM OCCUR

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log({ user });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    console.log({ user });
    const myPost = await PostService.getMyPostById(user?.id as string);
    // if(dele)
    return res.status(200).json({
      success: true,
      post: myPost,
      message: "Fetch my post Successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Error deleting postsss",
    });
  }
};

// * delete post

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log({ user });
    const { postId } = req.params;
    const isAdmin = user?.role === UserRole.ADMIN;
    const data = await PostService.deletePost(
      postId as string,
      user?.id as string,
      isAdmin
    );
    return res.status(200).json({ data });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "delete post failed";
    res.status(400).json({ message: errorMessage });
    return res.status(404).json({
      success: false,
      message: errorMessage,
    });
  }
};
//* Dashboard data show info add
const statePost = async (req: Request, res: Response) => {
  try {
    const data = await PostService.stateService();
    return res.status(200).json({ data: data });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "state data failed";
    res.status(400).json({ message: errorMessage });
    return res.status(404).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const PostController = {
  postController,
  getController,
  getPostById,
  deletePostById,
  getMyPost,
  updatePost,
  deletePost,
  statePost,
};
