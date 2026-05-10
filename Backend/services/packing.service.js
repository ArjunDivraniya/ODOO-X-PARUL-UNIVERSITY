const { prisma } = require('../lib/prisma');

class PackingService {
  async createItem(userId, data) {
    const trip = await prisma.trip.findFirst({ where: { id: data.tripId, userId } });
    if (!trip) throw new Error('Trip not found or unauthorized');

    return await prisma.packingChecklist.create({
      data: { ...data, userId }
    });
  }

  async getTripChecklist(tripId, userId, query) {
    const where = { tripId, userId };
    if (query.category) where.category = query.category;
    if (query.packed !== undefined) where.isPacked = query.packed === 'true';

    const items = await prisma.packingChecklist.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Grouping and Summary
    const summary = {
      totalItems: items.length,
      packedItems: items.filter(i => i.isPacked).length,
      remainingItems: 0,
      progressPercentage: 0
    };
    summary.remainingItems = summary.totalItems - summary.packedItems;
    summary.progressPercentage = summary.totalItems > 0 
      ? Math.round((summary.packedItems / summary.totalItems) * 100) 
      : 0;

    const groupedItems = items.reduce((acc, item) => {
      const cat = item.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return {
      items: Object.entries(groupedItems).map(([category, list]) => ({ category, list })),
      summary
    };
  }

  async updateItem(itemId, userId, data) {
    const item = await prisma.packingChecklist.findUnique({ where: { id: itemId } });
    if (!item || item.userId !== userId) throw new Error('Item not found or unauthorized');

    return await prisma.packingChecklist.update({
      where: { id: itemId },
      data
    });
  }

  async deleteItem(itemId, userId) {
    const item = await prisma.packingChecklist.findUnique({ where: { id: itemId } });
    if (!item || item.userId !== userId) throw new Error('Item not found or unauthorized');

    return await prisma.packingChecklist.delete({ where: { id: itemId } });
  }

  async toggleItemStatus(itemId, userId) {
    const item = await prisma.packingChecklist.findUnique({ where: { id: itemId } });
    if (!item || item.userId !== userId) throw new Error('Item not found or unauthorized');

    return await prisma.packingChecklist.update({
      where: { id: itemId },
      data: { isPacked: !item.isPacked }
    });
  }

  async resetChecklist(tripId, userId) {
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    if (!trip) throw new Error('Trip not found or unauthorized');

    return await prisma.packingChecklist.deleteMany({
      where: { tripId, userId }
    });
  }
}

module.exports = new PackingService();
