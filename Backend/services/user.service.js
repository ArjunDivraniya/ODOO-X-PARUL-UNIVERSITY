const { prisma } = require('../lib/prisma');
const { deleteFromCloudinary } = require('../utils/cloudinary');

class UserService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        bio: true,
        city: true,
        country: true,
        profileImage: true,
        coverImage: true,
        role: true,
        isVerified: true,
        onboardingComplete: true,
        socialLinks: true,
        preferences: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            trips: true,
            savedTrips: true,
            favorites: true
          }
        }
      }
    });

    if (!user) throw new Error('User not found');

    // Fetch related stats
    const completedTrips = await prisma.trip.count({
      where: { userId, status: 'COMPLETED' }
    });

    const totalExpensesAggr = await prisma.expense.aggregate({
      where: { trip: { userId } },
      _sum: { amount: true }
    });

    // Calculate Completion Percentage
    let completionScore = 0;
    const fieldsToCheck = [
      user.firstName, user.lastName, user.username, user.phoneNumber, 
      user.bio, user.city, user.country, user.profileImage, user.coverImage
    ];
    fieldsToCheck.forEach(field => {
      if (field) completionScore += 1;
    });
    const completionPercentage = Math.round((completionScore / fieldsToCheck.length) * 100);

    return {
      ...user,
      stats: {
        totalTrips: user._count.trips,
        completedTrips,
        savedPlaces: user._count.favorites,
        totalExpenses: totalExpensesAggr._sum.amount || 0
      },
      completionPercentage
    };
  }

  async updateProfile(userId, updateData) {
    // Validate unique constraints if updating username
    if (updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          id: { not: userId }
        }
      });
      if (existingUser) throw new Error('Username is already taken');
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        bio: true,
        city: true,
        country: true,
        profileImage: true,
        coverImage: true,
        role: true,
        isVerified: true,
        onboardingComplete: true,
        socialLinks: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deleteAccount(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    // Delete Cloudinary assets if they exist
    if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
      const publicId = this.extractCloudinaryPublicId(user.profileImage);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    
    if (user.coverImage && user.coverImage.includes('cloudinary.com')) {
      const publicId = this.extractCloudinaryPublicId(user.coverImage);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    // Prisma handles cascading deletes based on the schema config
    await prisma.user.delete({
      where: { id: userId }
    });

    return true;
  }

  extractCloudinaryPublicId(url) {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return filename.split('.')[0];
    } catch (e) {
      return null;
    }
  }
  async updateProfileImage(userId, fileBuffer) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
      const publicId = this.extractCloudinaryPublicId(user.profileImage);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    const { uploadToCloudinary } = require('../utils/cloudinary');
    const result = await uploadToCloudinary(fileBuffer, 'traveloop/profiles');
    
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: result.secure_url }
    });

    return result.secure_url;
  }

  async updateCoverImage(userId, fileBuffer) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (user.coverImage && user.coverImage.includes('cloudinary.com')) {
      const publicId = this.extractCloudinaryPublicId(user.coverImage);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    const { uploadToCloudinary } = require('../utils/cloudinary');
    const result = await uploadToCloudinary(fileBuffer, 'traveloop/covers');
    
    await prisma.user.update({
      where: { id: userId },
      data: { coverImage: result.secure_url }
    });

    return result.secure_url;
  }

  async getDashboardStats(userId) {
    const [
      totalTrips,
      completedTrips,
      activeTrips,
      plannedTrips,
      savedPlaces,
      favoritePlaces,
      expensesAggr,
      allCompletedTrips
    ] = await Promise.all([
      prisma.trip.count({ where: { userId } }),
      prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.trip.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.trip.count({ where: { userId, status: 'PLANNING' } }),
      prisma.savedTrip.count({ where: { userId } }),
      prisma.favoritePlace.count({ where: { userId } }),
      prisma.expense.aggregate({
        where: { trip: { userId } },
        _sum: { amount: true }
      }),
      prisma.trip.findMany({
        where: { userId, status: 'COMPLETED' },
        include: { itinerarySections: { include: { city: true } } }
      })
    ]);

    const citiesSet = new Set();
    const countriesSet = new Set();

    allCompletedTrips.forEach(trip => {
      trip.itinerarySections.forEach(section => {
        if (section.city) {
          citiesSet.add(section.city.id);
          countriesSet.add(section.city.country);
        }
      });
    });

    return {
      totalTrips,
      completedTrips,
      activeTrips,
      plannedTrips,
      savedPlaces,
      favoritePlaces,
      totalExpenses: expensesAggr._sum.amount || 0,
      countriesVisited: countriesSet.size,
      citiesVisited: citiesSet.size
    };
  }

  async getActivitySummary(userId) {
    const [recentTrips, recentActivities, recentExpenses, recentNotes, notifications] = await Promise.all([
      prisma.trip.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.activity.findMany({ where: { trip: { userId } }, orderBy: { createdAt: 'desc' }, take: 5, include: { city: true } }),
      prisma.expense.findMany({ where: { trip: { userId } }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.travelNote.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 })
    ]);

    return {
      recentTrips,
      recentActivities,
      recentExpenses,
      recentNotes,
      notifications
    };
  }

  async getTravelHistory(userId, page, limit, status) {
    const skip = (page - 1) * limit;
    const where = { userId };
    
    if (status) {
      where.status = status;
    } else {
      where.status = 'COMPLETED';
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          itinerarySections: {
            include: { city: true }
          },
          _count: {
            select: { expenses: true, activities: true }
          }
        }
      }),
      prisma.trip.count({ where })
    ]);

    return {
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getSavedTrips(userId) {
    const savedTrips = await prisma.savedTrip.findMany({
      where: { userId },
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            estimatedBudget: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return savedTrips.map(st => st.trip);
  }

  async getFavoritePlaces(userId) {
    const favoritePlaces = await prisma.favoritePlace.findMany({
      where: { userId },
      include: {
        city: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return favoritePlaces.map(fp => fp.city);
  }
}

module.exports = new UserService();
