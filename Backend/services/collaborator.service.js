const prisma = require('../lib/prisma');
const emailService = require('../utils/email.service');

class CollaboratorService {
  async inviteCollaborator(userId, data) {
    const trip = await prisma.trip.findUnique({
      where: { id: data.tripId },
      include: { user: true }
    });

    if (!trip || trip.userId !== userId) {
      throw new Error('Trip not found or unauthorized');
    }

    const invitee = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!invitee) throw new Error('Invited user not found on Traveloop');
    if (invitee.id === userId) throw new Error('You cannot invite yourself');

    const existing = await prisma.tripCollaborator.findFirst({
      where: { tripId: data.tripId, userId: invitee.id }
    });

    if (existing) throw new Error('User is already a collaborator');

    const collaborator = await prisma.tripCollaborator.create({
      data: {
        tripId: data.tripId,
        userId: invitee.id,
        permission: data.permission
      },
      include: { user: { select: { firstName: true, avatar: true, email: true } } }
    });

    // Send Email
    await emailService.sendCollaboratorInvite(
      invitee.email,
      trip.user.firstName,
      trip.title,
      data.permission
    );

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: invitee.id,
        title: 'Trip Invitation',
        message: `${trip.user.firstName} invited you to collaborate on ${trip.title}`,
        type: 'INFO'
      }
    });

    return collaborator;
  }

  async getCollaborators(tripId, userId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { 
        collaborators: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } } }
        }
      }
    });

    if (!trip) throw new Error('Trip not found');

    const isOwner = trip.userId === userId;
    const isCollaborator = trip.collaborators.some(c => c.userId === userId);

    if (!isOwner && !isCollaborator) throw new Error('Unauthorized access');

    return trip.collaborators;
  }

  async updatePermission(collaboratorId, userId, permission) {
    const col = await prisma.tripCollaborator.findUnique({
      where: { id: collaboratorId },
      include: { trip: true }
    });

    if (!col || col.trip.userId !== userId) {
      throw new Error('Unauthorized or collaborator not found');
    }

    return await prisma.tripCollaborator.update({
      where: { id: collaboratorId },
      data: { permission }
    });
  }

  async removeCollaborator(collaboratorId, userId) {
    const col = await prisma.tripCollaborator.findUnique({
      where: { id: collaboratorId },
      include: { trip: true }
    });

    if (!col) throw new Error('Collaborator not found');

    const isOwner = col.trip.userId === userId;
    const isSelf = col.userId === userId;

    if (!isOwner && !isSelf) throw new Error('Unauthorized to remove collaborator');

    return await prisma.tripCollaborator.delete({
      where: { id: collaboratorId }
    });
  }
}

module.exports = new CollaboratorService();
