const { prisma } = require('../lib/prisma');
const generateSlug = require('../utils/slugGenerator');
const generateShareCode = require('../utils/shareCodeGenerator');
const geminiService = require('./gemini.service');
const promptService = require('./prompt.service');

class TripService {
  async createTrip(userId, data, fileBuffer) {
    const slug = await generateSlug(data.title);
    const shareCode = await generateShareCode();
    
    let coverImage = null;
    if (fileBuffer) {
      const { uploadToCloudinary } = require('../utils/cloudinary');
      const result = await uploadToCloudinary(fileBuffer, 'traveloop/trips');
      coverImage = result.secure_url;
    }

    return await prisma.trip.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        slug,
        shareCode,
        tripType: data.tripType,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        estimatedBudget: data.estimatedBudget,
        currency: data.currency || 'INR',
        travelersCount: data.travelersCount || 1,
        visibility: data.visibility || 'PRIVATE',
        aiGenerated: data.aiGenerated || false,
        coverImage
      }
    });
  }

  async getTrips(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.status) where.status = query.status;
    if (query.visibility) where.visibility = query.visibility;

    const orderBy = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { itinerarySections: true, activities: true, expenses: true }
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

  async getTripById(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        itinerarySections: {
          orderBy: { sectionOrder: 'asc' },
          include: { city: true }
        },
        activities: {
          orderBy: { startTime: 'asc' }
        },
        expenses: {
          orderBy: { expenseDate: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        packingLists: true,
        collaborators: {
          include: { user: { select: { id: true, firstName: true, lastName: true, profileImage: true } } }
        }
      }
    });

    if (!trip) throw new Error('Trip not found');

    if (trip.userId !== userId && trip.visibility === 'PRIVATE') {
      const isCollaborator = trip.collaborators.some(c => c.userId === userId);
      if (!isCollaborator) throw new Error('Unauthorized access to this trip');
    }

    return trip;
  }

  async updateTrip(tripId, userId, data, fileBuffer) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized');

    const updateData = { ...data };
    
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    if (data.title && data.title !== trip.title) {
      updateData.slug = await generateSlug(data.title);
    }

    if (fileBuffer) {
      const { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } = require('../utils/cloudinary');
      if (trip.coverImage && trip.coverImage.includes('cloudinary.com')) {
        const publicId = extractCloudinaryPublicId(trip.coverImage);
        if (publicId) await deleteFromCloudinary(publicId);
      }
      const result = await uploadToCloudinary(fileBuffer, 'traveloop/trips');
      updateData.coverImage = result.secure_url;
    }

    return await prisma.trip.update({
      where: { id: tripId },
      data: updateData
    });
  }

  async deleteTrip(tripId, userId) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized to delete this trip');

    if (trip.coverImage && trip.coverImage.includes('cloudinary.com')) {
      const { extractCloudinaryPublicId, deleteFromCloudinary } = require('../utils/cloudinary');
      const publicId = extractCloudinaryPublicId(trip.coverImage);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    // Prisma Cascade handles related records like sections, activities, etc.
    await prisma.trip.delete({
      where: { id: tripId }
    });

    return true;
  }

  async updateTripVisibility(tripId, userId, visibility) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized');

    let shareCode = trip.shareCode;
    if ((visibility === 'PUBLIC' || visibility === 'FRIENDS') && !shareCode) {
      shareCode = await generateShareCode();
    }

    return await prisma.trip.update({
      where: { id: tripId },
      data: { visibility, shareCode }
    });
  }

  async updateTripStatus(tripId, userId, status) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized');

    return await prisma.trip.update({
      where: { id: tripId },
      data: { status }
    });
  }

  async duplicateTrip(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        itinerarySections: true,
        activities: true,
        packingLists: true
      }
    });

    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId && trip.visibility === 'PRIVATE') throw new Error('Unauthorized');

    const newSlug = await generateSlug(`Copy of ${trip.title}`);
    const newShareCode = await generateShareCode();

    const newTrip = await prisma.trip.create({
      data: {
        userId,
        title: `Copy of ${trip.title}`,
        slug: newSlug,
        shareCode: newShareCode,
        description: trip.description,
        coverImage: trip.coverImage, // Note: they will share the exact same cloudinary image reference
        startDate: trip.startDate,
        endDate: trip.endDate,
        tripType: trip.tripType,
        visibility: 'PRIVATE',
        status: 'PLANNING',
        estimatedBudget: trip.estimatedBudget,
        currency: trip.currency,
        travelersCount: trip.travelersCount,
        aiGenerated: trip.aiGenerated,
      }
    });

    // We can run these sequentially to avoid overwhelming the DB
    for (const section of trip.itinerarySections) {
      await prisma.tripSection.create({
        data: {
          tripId: newTrip.id,
          title: section.title,
          description: section.description,
          cityId: section.cityId,
          startDate: section.startDate,
          endDate: section.endDate,
          sectionOrder: section.sectionOrder,
          estimatedBudget: section.estimatedBudget,
          transportType: section.transportType,
          coverImage: section.coverImage
        }
      });
    }

    // Map activities
    for (const activity of trip.activities) {
      await prisma.activity.create({
        data: {
          tripId: newTrip.id,
          title: activity.title,
          description: activity.description,
          category: activity.category,
          activityType: activity.activityType,
          location: activity.location,
          startTime: activity.startTime,
          endTime: activity.endTime,
          duration: activity.duration,
          price: activity.price,
          image: activity.image,
          cityId: activity.cityId
        }
      });
    }

    // Map checklist
    for (const item of trip.packingLists) {
      await prisma.packingChecklist.create({
        data: {
          tripId: newTrip.id,
          userId,
          title: item.title,
          category: item.category,
          priority: item.priority
        }
      });
    }

    return newTrip;
  }

  async shareTrip(tripId, userId) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized');

    let shareCode = trip.shareCode;
    if (!shareCode) {
      shareCode = await generateShareCode();
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { visibility: 'PUBLIC', shareCode }
    });

    return shareCode;
  }

  async getSharedTrip(shareCode) {
    const trip = await prisma.trip.findUnique({
      where: { shareCode },
      include: {
        owner: { select: { firstName: true, lastName: true, profileImage: true, username: true } },
        itinerarySections: { include: { city: true }, orderBy: { sectionOrder: 'asc' } },
        activities: { orderBy: { startTime: 'asc' } },
        _count: { select: { expenses: true, notes: true, activities: true } }
      }
    });

    if (!trip) throw new Error('Trip not found or invalid share code');
    if (trip.visibility === 'PRIVATE') throw new Error('This trip is private');

    return trip;
  }

  async getTripOverview(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        itinerarySections: { include: { city: true } },
        _count: { select: { activities: true, expenses: true, notes: true, packingLists: true } },
        expenses: true,
        packingLists: true
      }
    });

    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId && trip.visibility === 'PRIVATE') throw new Error('Unauthorized');

    const totalDays = (trip.startDate && trip.endDate) 
      ? Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24))
      : 0;

    const citiesCount = new Set(trip.itinerarySections.map(s => s.cityId).filter(Boolean)).size;
    
    const expensesTotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetUsedPercentage = trip.estimatedBudget 
      ? Math.min(100, Math.round((expensesTotal / trip.estimatedBudget) * 100))
      : 0;

    const packedItems = trip.packingLists.filter(p => p.isPacked).length;
    const packingProgress = trip.packingLists.length 
      ? Math.round((packedItems / trip.packingLists.length) * 100)
      : 0;

    return {
      totalDays,
      citiesCount,
      activitiesCount: trip._count.activities,
      expensesSummary: {
        total: expensesTotal,
        estimatedBudget: trip.estimatedBudget,
        percentageUsed: budgetUsedPercentage
      },
      packingProgress,
      timeline: {
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status
      }
    };
  }

  async getTripAnalytics(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        expenses: true,
        activities: { include: { city: true } },
        itinerarySections: { include: { city: true } }
      }
    });

    if (!trip) throw new Error('Trip not found');
    if (trip.userId !== userId) throw new Error('Unauthorized');

    // Expense Breakdown
    const expenseBreakdown = {};
    trip.expenses.forEach(exp => {
      expenseBreakdown[exp.category] = (expenseBreakdown[exp.category] || 0) + exp.amount;
    });

    // Activity Analysis
    const activityAnalysis = {};
    trip.activities.forEach(act => {
      activityAnalysis[act.category] = (activityAnalysis[act.category] || 0) + 1;
    });

    // City Statistics
    const cityStats = {};
    trip.itinerarySections.forEach(section => {
      if (section.city) {
        cityStats[section.city.name] = {
          days: (section.startDate && section.endDate) ? Math.ceil((section.endDate - section.startDate) / (1000 * 60 * 60 * 24)) : 0,
          activities: 0,
          expenses: 0
        };
      }
    });

    trip.activities.forEach(act => {
      if (act.city && cityStats[act.city.name]) {
        cityStats[act.city.name].activities++;
      }
    });

    return {
      expenseBreakdown,
      activityAnalysis,
      cityStats,
      budget: {
        estimated: trip.estimatedBudget,
        actual: trip.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      }
    };
  }

  async generateAITrip(userId, options) {
    const { destination, duration, budget, tripType, interests } = options;
    
    const prompt = promptService.getDetailedTripPlanPrompt(options);
    const aiPlan = await geminiService.generateJSON(prompt);
    
    if (!aiPlan) throw new Error('AI failed to generate a trip plan');

    const slug = await generateSlug(aiPlan.title);
    const shareCode = await generateShareCode();

    // Try to find a city ID for the destination
    const city = await prisma.city.findFirst({
      where: { name: { contains: destination, mode: 'insensitive' } }
    });

    // Create the Trip
    const trip = await prisma.trip.create({
      data: {
        userId,
        title: aiPlan.title,
        description: aiPlan.description,
        destination,
        slug,
        shareCode,
        tripType: tripType || 'LEISURE',
        estimatedBudget: aiPlan.estimatedBudget,
        aiGenerated: true,
        status: 'PLANNING',
        visibility: 'PRIVATE'
      }
    });

    // Create sections and activities
    if (aiPlan.itinerarySections && Array.isArray(aiPlan.itinerarySections)) {
      for (const section of aiPlan.itinerarySections) {
        const createdSection = await prisma.tripSection.create({
          data: {
            tripId: trip.id,
            title: section.title,
            description: section.description,
            sectionOrder: section.sectionOrder || 0,
            cityId: city?.id
          }
        });

        if (section.activities && Array.isArray(section.activities)) {
          await prisma.activity.createMany({
            data: section.activities.map(act => ({
              tripId: trip.id,
              sectionId: createdSection.id,
              title: act.title,
              description: act.description,
              category: act.category || 'RELAXATION',
              location: act.location,
              price: act.price || 0,
              aiRecommended: true,
              cityId: city?.id
            }))
          });
        }
      }
    }

    return await this.getTripById(trip.id, userId);
  }
}

module.exports = new TripService();
