const { prisma } = require('../lib/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

class CommunityService {
  async createPost(userId, data, files = []) {
    const imageUrls = await this._uploadFiles(files);

    return await prisma.communityPost.create({
      data: {
        ...data,
        userId,
        images: imageUrls
      },
      include: { 
        user: { select: { firstName: true, lastName: true, avatar: true } },
        trip: { select: { title: true, destination: true } }
      }
    });
  }

  async getFeed(query, userId = null) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { visibility: 'PUBLIC' };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (query.type === 'TRENDING') {
      orderBy = [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
        { createdAt: 'desc' }
      ];
    } else if (query.sortBy) {
      orderBy = { [query.sortBy]: query.sortOrder || 'desc' };
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
          trip: { select: { title: true, destination: true } },
          likes: userId ? { where: { userId } } : false
        }
      }),
      prisma.communityPost.count({ where })
    ]);

    const formattedPosts = posts.map(post => ({
      ...post,
      isLiked: post.likes?.length > 0,
      likes: undefined
    }));

    return {
      posts: formattedPosts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getPostById(postId, userId = null) {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, bio: true } },
        trip: { include: { sections: true } },
        likes: userId ? { where: { userId } } : false,
        _count: { select: { comments: true, likes: true } }
      }
    });

    if (!post) throw new Error('Post not found');

    return {
      ...post,
      isLiked: post.likes?.length > 0,
      likes: undefined
    };
  }

  async updatePost(postId, userId, data, files = []) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new Error('Post not found or unauthorized');

    let imageUrls = post.images;
    if (files.length > 0) {
      const newUrls = await this._uploadFiles(files);
      imageUrls = [...imageUrls, ...newUrls];
    }

    return await prisma.communityPost.update({
      where: { id: postId },
      data: { ...data, images: imageUrls },
      include: { user: { select: { firstName: true, avatar: true } } }
    });
  }

  async deletePost(postId, userId) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new Error('Post not found or unauthorized');

    for (const url of post.images) {
      const publicId = url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`traveloop/community/${publicId}`).catch(() => {});
    }

    return await prisma.communityPost.delete({ where: { id: postId } });
  }

  async likePost(userId, postId) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_postId: { userId, postId } }
      });

      if (existing) return existing;

      const like = await tx.like.create({ data: { userId, postId } });
      await tx.communityPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      });

      return like;
    });
  }

  async unlikePost(userId, postId) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_postId: { userId, postId } }
      });

      if (!existing) return null;

      await tx.like.delete({ where: { id: existing.id } });
      await tx.communityPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      });

      return true;
    });
  }

  async addComment(userId, postId, content) {
    return await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: { userId, postId, content },
        include: { user: { select: { firstName: true, avatar: true } } }
      });

      await tx.communityPost.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } }
      });

      return comment;
    });
  }

  async getComments(postId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } }
      }),
      prisma.comment.count({ where: { postId } })
    ]);

    return {
      comments,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async _uploadFiles(files) {
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'traveloop/community' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    return await Promise.all(uploadPromises);
  }
}

module.exports = new CommunityService();
