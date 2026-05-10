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
}

module.exports = new UserService();
