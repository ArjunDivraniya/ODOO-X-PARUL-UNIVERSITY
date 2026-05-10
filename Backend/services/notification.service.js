const prisma = require('../lib/prisma');

class NotificationService {
  async getNotifications(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (query.isRead !== undefined) {
      where.isRead = query.isRead === 'true';
    }

    const [notifications, unreadCount, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.notification.count({ where })
    ]);

    return {
      notifications,
      unreadCount,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async markAsRead(notificationId, userId) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  async deleteNotification(notificationId, userId) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await prisma.notification.delete({ where: { id: notificationId } });
  }

  // Helper for internal use
  async createNotification(data) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO'
      }
    });
  }
}

module.exports = new NotificationService();
