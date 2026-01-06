import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  //   console.log("comment creation -> ", payload);

  //   no need to check authorId , because it can be predefined handle middleware
  // Ensure post exists
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  //   check comment exist ,if you want to reply or comment another
  // If reply, ensure parent comment exists
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId as string,
      },
    });
  }
  // create comment
  return await prisma.comment.create({
    data: payload,
  });
};
// get comment by id
const getCommentById = async (id: string) => {
  // console.log("comment id: ", id);
  return await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          content: true,
        },
      },
    },
  });
};
// get author by id
const getCommentByIdAuthor = async (authorId: string) => {
  // console.log("author id ", authorId);
  // get particular ( author/user ) comment one or many
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    // each comment which post belong
    include: {
      post: true,
    },
  });
};

// update comment
//authorId,data, commentId
const updateComment = async (
  commentId: string,
  data: { content: string; status?: CommentStatus },
  authorId: string
) => {
  // check comment exist or authorId
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("comment data not found");
  }
  // console.log({ commentId, data, authorId });

  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId: authorId,
    },
    data,
  });
};

// Admin Comment Status Management
const moderateComment = async (
  commentId: string,
  data: { status: CommentStatus }
) => {
  // check comment exist or authorId
  // only admin can moderate comment , so no need to check authorId or admin id

  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("comment data not found");
  }
  // console.log({ commentId, data, authorId });

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: data.status,
    },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByIdAuthor,
  updateComment,
  moderateComment,
};
