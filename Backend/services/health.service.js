const prisma = require('../lib/prisma');

class HealthService {
  async getStatus() {
    let dbStatus = 'connected';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'disconnected';
    }

    return {
      server: 'running',
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  getVersion() {
    return {
      appName: 'Traveloop API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }
}

module.exports = new HealthService();
