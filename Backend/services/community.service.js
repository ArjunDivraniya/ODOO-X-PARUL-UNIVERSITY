const { prisma } = require('../lib/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

class CommunityService {
  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  /** Normalise files from upload.fields() or upload.array() into a flat array */
  _normalizeFiles(files) {
    if (!files) return [];
    if (Array.isArray(files)) return files;
    // upload.fields() returns { image: [file], images: [file,...] }
    return [
      ...(files.image || []),
      ...(files.images || [])
    ];
  }

  async _uploadFiles(files) {
    const flatFiles = this._normalizeFiles(files);
    const uploadPromises = flatFiles.map(file =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'traveloop/community' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      })
    );
    return await Promise.all(uploadPromises);
  }

  /** Standard user select — uses profileImage which is the actual DB field */
  _userSelect() {
    return {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      bio: true
    };
  }

  /** Full trip include for community post details */
  _tripInclude() {
    return {
      id: true,
      title: true,
      destination: true,
      description: true,
      coverImage: true,
      startDate: true,
      endDate: true,
      estimatedBudget: true,
      currency: true,
      visibility: true,
      itinerarySections: {
        orderBy: { sectionOrder: 'asc' },
        include: {
          activities: {
            orderBy: { startTime: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              startTime: true,
              endTime: true,
              location: true,
              price: true,
              image: true
            }
          }
        }
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true
        }
      }
    };
  }

  // ─────────────────────────────────────────────
  // CRUD
  // ─────────────────────────────────────────────

  async createPost(userId, data, files = []) {
    const imageUrls = await this._uploadFiles(files);

    return await prisma.communityPost.create({
      data: {
        ...data,
        userId,
        images: imageUrls
      },
      include: {
        user: { select: this._userSelect() },
        trip: { select: { id: true, title: true, destination: true, coverImage: true } }
      }
    });
  }

  async getFeed(query, userId = null) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};

    // Visibility: PUBLIC always visible; FRIENDS visible if logged in
    if (userId) {
      where.OR = [
        { visibility: 'PUBLIC' },
        { visibility: 'FRIENDS' }
      ];
    } else {
      where.visibility = 'PUBLIC';
    }

    if (query.search) {
      const searchClause = {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } }
        ]
      };
      where.AND = [searchClause];
    }

    let orderBy = { createdAt: 'desc' };
    if (query.type === 'TRENDING') {
      orderBy = [{ likesCount: 'desc' }, { commentsCount: 'desc' }, { createdAt: 'desc' }];
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
          user: { select: this._userSelect() },
          trip: { select: { id: true, title: true, destination: true, coverImage: true } },
          likes: userId ? { where: { userId } } : false
        }
      }),
      prisma.communityPost.count({ where })
    ]);

    const formattedPosts = posts.map(post => ({
      ...post,
      author: post.user,
      isLiked: post.likes?.length > 0,
      user: undefined,
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
        user: { select: this._userSelect() },
        trip: {
          select: this._tripInclude()
        },
        likes: userId ? { where: { userId } } : false,
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
          }
        },
        _count: { select: { comments: true, likes: true } }
      }
    });

    if (!post) throw new Error('Post not found');

    return {
      ...post,
      author: post.user,
      isLiked: post.likes?.length > 0,
      user: undefined,
      likes: undefined
    };
  }

  async updatePost(postId, userId, data, files = []) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new Error('Post not found or unauthorized');

    let imageUrls = post.images;
    const newFiles = this._normalizeFiles(files);
    if (newFiles.length > 0) {
      const newUrls = await this._uploadFiles(files);
      imageUrls = [...imageUrls, ...newUrls];
    }

    return await prisma.communityPost.update({
      where: { id: postId },
      data: { ...data, images: imageUrls },
      include: { user: { select: this._userSelect() } }
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

  // ─────────────────────────────────────────────
  // Social: Likes
  // ─────────────────────────────────────────────

  async likePost(userId, postId) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_postId: { userId, postId } }
      });

      if (existing) {
        // Toggle off
        await tx.like.delete({ where: { id: existing.id } });
        await tx.communityPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        });
        return { liked: false };
      }

      await tx.like.create({ data: { userId, postId } });
      await tx.communityPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      });
      return { liked: true };
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

  // ─────────────────────────────────────────────
  // Social: Comments
  // ─────────────────────────────────────────────

  async addComment(userId, postId, content) {
    return await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: { userId, postId, content },
        include: { user: { select: { id: true, firstName: true, lastName: true, profileImage: true } } }
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
        include: { user: { select: { id: true, firstName: true, lastName: true, profileImage: true } } }
      }),
      prisma.comment.count({ where: { postId } })
    ]);

    return {
      comments,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  // ─────────────────────────────────────────────
  // Save / Copy Trip
  // ─────────────────────────────────────────────

  /**
   * Save (bookmark) a trip from a post to the user's saved trips.
   */
  async savePostTrip(userId, postId) {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { tripId: true }
    });
    if (!post?.tripId) throw new Error('This post has no attached trip');

    return await prisma.savedTrip.upsert({
      where: { userId_tripId: { userId, tripId: post.tripId } },
      update: {},
      create: { userId, tripId: post.tripId }
    });
  }

  /**
   * Copy (clone) a shared trip from a post into the user's own trips.
   * Duplicates sections, activities, and notes with a new owner.
   */
  async copyPostTrip(userId, postId) {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        trip: {
          include: {
            itinerarySections: {
              include: { activities: true }
            },
            notes: true
          }
        }
      }
    });

    if (!post?.trip) throw new Error('This post has no attached trip to copy');
    const src = post.trip;

    // Ensure the trip is PUBLIC or FRIENDS
    if (src.visibility === 'PRIVATE') throw new Error('This trip is private and cannot be copied');

    const newTrip = await prisma.$transaction(async (tx) => {
      // 1. Clone trip
      const trip = await tx.trip.create({
        data: {
          userId,
          title: `${src.title} (Copy)`,
          description: src.description,
          destination: src.destination,
          startDate: src.startDate,
          endDate: src.endDate,
          estimatedBudget: src.estimatedBudget,
          currency: src.currency,
          tripType: src.tripType,
          visibility: 'PRIVATE',
          aiGenerated: false
        }
      });

      // 2. Clone sections + activities
      for (const section of src.itinerarySections) {
        const newSection = await tx.tripSection.create({
          data: {
            tripId: trip.id,
            title: section.title,
            description: section.description,
            sectionOrder: section.sectionOrder,
            estimatedBudget: section.estimatedBudget,
            transportType: section.transportType,
            startDate: section.startDate,
            endDate: section.endDate
          }
        });

        for (const act of section.activities) {
          await tx.activity.create({
            data: {
              tripId: trip.id,
              sectionId: newSection.id,
              cityId: act.cityId,
              title: act.title,
              description: act.description,
              category: act.category,
              activityType: act.activityType,
              location: act.location,
              startTime: act.startTime,
              endTime: act.endTime,
              duration: act.duration,
              price: act.price,
              bookingUrl: act.bookingUrl,
              image: act.image
            }
          });
        }
      }

      // 3. Clone notes
      for (const note of src.notes) {
        await tx.travelNote.create({
          data: {
            tripId: trip.id,
            userId,
            title: note.title,
            content: note.content
          }
        });
      }

      return trip;
    });

    return newTrip;
  }
}

module.exports = new CommunityService();
