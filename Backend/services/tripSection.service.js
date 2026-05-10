const prisma = require('../lib/prisma');

class TripSectionService {
  async createSection(data) {
    // If sectionOrder is not provided, find the max order for the trip and increment
    if (data.sectionOrder === undefined) {
      const lastSection = await prisma.tripSection.findFirst({
        where: { tripId: data.tripId },
        orderBy: { sectionOrder: 'desc' },
        select: { sectionOrder: true }
      });
      data.sectionOrder = lastSection ? lastSection.sectionOrder + 1 : 0;
    }

    return await prisma.tripSection.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      },
      include: {
        city: true
      }
    });
  }

  async getTripSections(tripId) {
    return await prisma.tripSection.findMany({
      where: { tripId },
      orderBy: { sectionOrder: 'asc' },
      include: {
        city: true,
        _count: {
          select: {
            activities: true,
            expenses: true,
            notes: true
          }
        }
      }
    });
  }

  async getSectionById(sectionId) {
    return await prisma.tripSection.findUnique({
      where: { id: sectionId },
      include: {
        city: true,
        activities: {
          orderBy: { startTime: 'asc' }
        },
        expenses: {
          orderBy: { expenseDate: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async updateSection(sectionId, data) {
    const updateData = { ...data };
    
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return await prisma.tripSection.update({
      where: { id: sectionId },
      data: updateData,
      include: {
        city: true
      }
    });
  }

  async deleteSection(sectionId) {
    return await prisma.tripSection.delete({
      where: { id: sectionId }
    });
  }

  async reorderSections(reorderData) {
    // Use a transaction to ensure all updates succeed or fail together
    return await prisma.$transaction(
      reorderData.map((item) =>
        prisma.tripSection.update({
          where: { id: item.id },
          data: { sectionOrder: item.sectionOrder }
        })
      )
    );
  }

  async validateOwnership(sectionId, userId) {
    const section = await prisma.tripSection.findUnique({
      where: { id: sectionId },
      select: {
        trip: {
          select: { userId: true }
        }
      }
    });

    if (!section) return false;
    return section.trip.userId === userId;
  }

  async validateTripOwnership(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { userId: true }
    });

    if (!trip) return false;
    return trip.userId === userId;
  }
}

module.exports = new TripSectionService();
