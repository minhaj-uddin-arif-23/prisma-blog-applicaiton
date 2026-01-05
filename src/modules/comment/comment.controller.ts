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
      res.status(500).json({ message: "comment creating post" });
    }
  },
};

export const commentController = {
  commentCreate,
};
