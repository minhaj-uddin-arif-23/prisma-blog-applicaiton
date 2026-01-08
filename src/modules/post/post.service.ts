import { prisma } from "../../lib/prisma";
import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
  page,
  limit,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus;
  authorId: string | undefined;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
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
  //multiple array tags
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
  // page & limit
  const skip = (page - 1) * limit;
  const take = limit;
  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    // multiple search with different parameter use or
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  // count total data
  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });
  // how many page occur to show all data
  // total = 13, limit = 4, totalData = (total/limit) = 3.5 = 4
  const totalPage = Math.ceil(total / limit);
  // console.log({ totalPage });
  return {
    data: posts,
    pagination: {
      total,
      page,
      limit,
      totalPage,
    },
  };
};
// get post by id
// use transaction function to handle better response to data
const getPostById = async (id: string) => {
  return await prisma.$transaction(async (txf) => {
    await txf.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const getSinglePost = await txf.post.findUnique({
      where: { id },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVE,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVE,
                  },

                  include: {
                    replies: {
                      where: {
                        status: CommentStatus.APPROVE,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return getSinglePost;
  });
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

// * get my post
// TODO PROBLEM OCCUR
const getMyPostById = async (authorId: string) => {
  // * only active user user data get
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });
  console.log({ authorId });
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    // each post , show me how many comment exist
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  // count also post
  const totalPost = await prisma.post.aggregate({
    _count: {
      id: true,
    },
    where: {
      authorId,
    },
  });
  return {
    data: result,
    totalPost,
  };
};

// * update post data
/** 
 * step
   1. check post exist or not 
   2. match the post creation(already database authorId) and new update(data) authorId must be same 
   3. then update 
   FETATURE
   1.user update only own post , but one feature can't update [isFeatured]
   2.not only user update their own post , admin can also update post
 */
const updatePostData = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  // console.log({ postId, data, authorId });
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  // check author id admin also edit post
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error(
      "You are not creator on this post . so you can not update this post"
    );
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data,
  });
  return result;
};

// delete post

/**
 * USER ONYL delete own post
 * admin can delete all post
 * ------ step ----------
 * find post
 * check role
 * then delete
 **/

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const findPost = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!findPost) {
    throw new Error("Post not found");
  }

  // / check author id admin also edit post
  if (!isAdmin && findPost.authorId !== authorId) {
    throw new Error(
      "You are not creator on this post . so you can not delete this post"
    );
  }
  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const PostService = {
  postService,
  getAllPosts,
  getPostById,
  deleteSinglePost,
  getMyPostById,
  updatePostData,
  deletePost,
};
