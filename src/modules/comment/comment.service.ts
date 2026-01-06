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

export const commentService = {
  createComment,
  getCommentById,
  getCommentByIdAuthor,
};
