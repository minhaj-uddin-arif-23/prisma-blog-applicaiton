import { prisma } from "../../lib/prisma";
import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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
// get all posts
const getAllPosts = async ({
  search,
  tags,
}: {
  search: string | undefined;
  tags: string[] | [];
}) => {
  // console.log('payload -> ', payload)

  const andCondition: PostWhereInput[] = [];
  if (search) {
    // multiple array search
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          // if search with array use [has] ,[note:single array search]
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }
  // tags
  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  const posts = await prisma.post.findMany({
    // multiple search with different parameter use or
    where: {
      AND: andCondition,
    },
  });
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
