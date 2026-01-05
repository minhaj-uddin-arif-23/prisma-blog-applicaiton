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

export const commentService = {
  createComment,
};
