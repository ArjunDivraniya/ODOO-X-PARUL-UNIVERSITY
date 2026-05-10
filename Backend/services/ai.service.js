const { prisma } = require('../lib/prisma');
const geminiService = require('./gemini.service');
const promptService = require('./prompt.service');

class AIService {
  async generateTrip(userId, data) {
    const prompt = promptService.getTripGenerationPrompt(data);
    const result = await geminiService.generateJSON(prompt);

    // Track in history
    await prisma.aichat.create({
      data: {
        userId,
        prompt: `Generate trip to ${data.destination}`,
        response: JSON.stringify(result),
        modelUsed: 'gemini-1.5-flash'
      }
    });

    return result;
  }

  async chat(userId, message, tripId = null) {
    const prompt = promptService.getChatPrompt(message, { tripId });
    const result = await geminiService.generateJSON(prompt);

    await prisma.aichat.create({
      data: {
        userId,
        tripId,
        prompt: message,
        response: JSON.stringify(result),
        modelUsed: 'gemini-1.5-flash'
      }
    });

    return result;
  }

  async suggestActivities(data) {
    const prompt = promptService.getActivitySuggestionPrompt(data);
    return await geminiService.generateJSON(prompt);
  }

  async optimizeBudget(data) {
    const prompt = promptService.getBudgetOptimizationPrompt(data);
    return await geminiService.generateJSON(prompt);
  }

  async getPackingSuggestions(data) {
    const prompt = promptService.getPackingPrompt(data);
    return await geminiService.generateJSON(prompt);
  }

  async getHiddenGems(data) {
    const prompt = promptService.getHiddenGemsPrompt(data);
    return await geminiService.generateJSON(prompt);
  }

  async getWeatherPlanning(data) {
    const prompt = promptService.getWeatherPlannerPrompt(data);
    return await geminiService.generateJSON(prompt);
  }

  async getHistory(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (query.search) {
      where.prompt = { contains: query.search, mode: 'insensitive' };
    }

    const [history, total] = await Promise.all([
      prisma.aichat.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { trip: { select: { title: true } } }
      }),
      prisma.aichat.count({ where })
    ]);

    return {
      history: history.map(h => ({
        ...h,
        response: JSON.parse(h.response)
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }
}

module.exports = new AIService();
