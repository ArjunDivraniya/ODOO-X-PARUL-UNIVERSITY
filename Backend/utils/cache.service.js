const prisma = require('../lib/prisma');

class CacheService {
  async get(key) {
    const cached = await prisma.recommendationCache.findUnique({
      where: { key }
    });

    if (cached && cached.expiresAt > new Date()) {
      return cached.data;
    }

    if (cached) {
      // Clean up expired cache
      await prisma.recommendationCache.delete({ where: { key } }).catch(() => {});
    }

    return null;
  }

  async set(key, data, ttlSeconds = 3600 * 24) { // Default 24 hours
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    
    return await prisma.recommendationCache.upsert({
      where: { key },
      update: { data, expiresAt },
      create: { key, data, expiresAt }
    });
  }
}

module.exports = new CacheService();
