import { prisma } from "../../lib/prisma";
import { Post, PostStatus } from "../../../generated/prisma/client";
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
/*
const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: {
  search?: string;
  tags: string[];
  isFeatured?: boolean;
  status?: PostStatus;
  authorId?: string;
}) => {
  try {
    const andCondition: PostWhereInput[] = [];

    if (search) {
      andCondition.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ],
      });
    }

    if (tags.length > 0) {
      andCondition.push({
        tags: { hasEvery: tags },
      });
    }

    if (typeof isFeatured === "boolean") {
      andCondition.push({ isFeatured });
    }

    if (status) {
      andCondition.push({ status });
    }

    if (authorId) {
      andCondition.push({ authorId });
    }

    return await prisma.post.findMany({
      where: { AND: andCondition },
    });
  } catch (error) {
    console.error("POST_SERVICE_DB_ERROR:", error);
    throw new Error("Failed to fetch posts from database");
  }
};


*/

// get all posts
const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus;
  authorId: string | undefined;
}) => {
  // console.log('payload -> ', payload)

  const andCondition: PostWhereInput[] = [];
  // search
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
  // isFeatured
  if (typeof isFeatured === "boolean") {
    andCondition.push({ isFeatured });
  }
  // status
  if (typeof status === "string") {
    andCondition.push({ status });
  }
  // authorId
  if (authorId) {
    // console.log(authorId);
    andCondition.push({
      authorId,
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
