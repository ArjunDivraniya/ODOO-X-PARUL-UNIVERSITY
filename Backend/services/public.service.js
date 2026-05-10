const { prisma } = require('../lib/prisma');

class PublicService {
  async getPublicTrip(shareCode) {
    const trip = await prisma.trip.findFirst({
      where: { 
        shareCode,
        visibility: 'PUBLIC'
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        sections: {
          include: { activities: true }
        }
      }
    });

    if (!trip) throw new Error('Shared trip not found or private');

    return trip;
  }

  async copyTrip(shareCode, userId) {
    const originalTrip = await prisma.trip.findFirst({
      where: { shareCode, visibility: 'PUBLIC' },
      include: {
        sections: {
          include: { activities: true }
        },
        packingLists: true
      }
    });

    if (!originalTrip) throw new Error('Shared trip not found or private');

    const newShareCode = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await prisma.$transaction(async (tx) => {
      const newTrip = await tx.trip.create({
        data: {
          userId,
          title: `Copy of ${originalTrip.title}`,
          destination: originalTrip.destination,
          startDate: originalTrip.startDate,
          endDate: originalTrip.endDate,
          budget: originalTrip.budget,
          currency: originalTrip.currency,
          visibility: 'PRIVATE',
          status: 'PLANNING',
          shareCode: newShareCode
        }
      });

      // Copy sections and activities
      for (const section of originalTrip.sections) {
        const newSection = await tx.tripSection.create({
          data: {
            tripId: newTrip.id,
            title: section.title,
            dayNumber: section.dayNumber,
            date: section.date,
            order: section.order
          }
        });

        if (section.activities.length > 0) {
          await tx.activity.createMany({
            data: section.activities.map(act => ({
              tripId: newTrip.id,
              sectionId: newSection.id,
              title: act.title,
              description: act.description,
              category: act.category,
              startTime: act.startTime,
              endTime: act.endTime,
              location: act.location,
              cost: act.cost,
              currency: act.currency
            }))
          });
        }
      }

      // Copy packing list
      if (originalTrip.packingLists.length > 0) {
        await tx.packingChecklist.createMany({
          data: originalTrip.packingLists.map(item => ({
            userId,
            tripId: newTrip.id,
            title: item.title,
            category: item.category,
            priority: item.priority,
            isPacked: false
          }))
        });
      }

      return newTrip;
    });
  }
}

module.exports = new PublicService();
