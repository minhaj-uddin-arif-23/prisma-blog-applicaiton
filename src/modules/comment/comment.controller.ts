import { Request, Response } from "express";
import { commentService } from "./comment.service";

const commentCreate = {
  createComment: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      req.body.authorId = user?.id;
      const commentData = await commentService.createComment(req.body);
      return res.status(201).json({ commentData });
    } catch (error) {
      //   console.error("comment creating post:");
      res.status(500).json({ success: false, message: error });
    }
  },
};
const singleCommentGet = {
  getCommentById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const commentData = await commentService.getCommentById(id as string);
      return res.status(201).json({ commentData });
    } catch (error) {
      //   console.error("comment creating post:");
      res.status(500).json({ success: false, message: error });
    }
  },
};

const singleCommentGetAuthor = {
  getCommentByIdAuthor: async (req: Request, res: Response) => {
    try {
      const { authorId } = req.params;
      const commentData = await commentService.getCommentByIdAuthor(
        authorId as string
      );
      return res.status(201).json({ commentData });
    } catch (error) {
      //   console.error("comment creating post:");
      res.status(500).json({ success: false, message: error });
    }
  },
};

// update comment
const updateCommentData = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const data = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );
    // console.log({ user, commentId, data });
    // console.log({ data });
    return res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error });
  }
};

const moderateCommentData = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const data = await commentService.moderateComment(
      commentId as string,
      req.body
    );

    return res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error });
  }
};

export const commentController = {
  commentCreate,
  singleCommentGet,
  singleCommentGetAuthor,
  updateCommentData,
  moderateCommentData,
};
