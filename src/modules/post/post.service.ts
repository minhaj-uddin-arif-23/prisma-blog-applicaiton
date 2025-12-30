import { prisma } from "../../lib/prisma";
import { Post } from "../../../generated/prisma/client";
const postService = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return post;
};
const getAllPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};
// get post by id
const getPostById = async (id: string) => {
  const getSinglePost = await prisma.post.findUnique({
    where: { id },
  });
  return getSinglePost;
};

// delete single post
const deleteSinglePost = async (id: string) => {
  const deletedPost = await prisma.post.findUnique({
    where: { id },
  });
  if (!deletedPost) {
    throw new Error("Post not found");
  }
  return await prisma.post.delete({
    where: { id },
    // return deletedPost;
  });
};
export const PostService = {
  postService,
  getAllPosts,
  getPostById,
  deleteSinglePost,
};
