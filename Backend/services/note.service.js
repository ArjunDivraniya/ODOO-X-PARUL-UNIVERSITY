const { prisma } = require('../lib/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

class NoteService {
  async createNote(userId, data, files = []) {
    const trip = await prisma.trip.findFirst({ where: { id: data.tripId, userId } });
    if (!trip) throw new Error('Trip not found or unauthorized');

    const attachmentUrls = await this._uploadFiles(files);

    return await prisma.travelNote.create({
      data: {
        ...data,
        userId,
        attachments: attachmentUrls
      },
      include: { section: true }
    });
  }

  async getTripNotes(tripId, userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { tripId, userId };
    if (query.noteType) where.noteType = query.noteType;

    const [notes, total] = await Promise.all([
      prisma.travelNote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        include: { section: true }
      }),
      prisma.travelNote.count({ where })
    ]);

    return {
      notes,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getNoteById(noteId, userId) {
    const note = await prisma.travelNote.findUnique({
      where: { id: noteId },
      include: { trip: true, section: true, user: { select: { firstName: true, lastName: true, avatar: true } } }
    });

    if (!note || note.userId !== userId) {
      throw new Error('Note not found or unauthorized');
    }

    return note;
  }

  async updateNote(noteId, userId, data, files = []) {
    const note = await prisma.travelNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error('Note not found or unauthorized');

    let attachmentUrls = note.attachments;
    if (files.length > 0) {
      const newUrls = await this._uploadFiles(files);
      attachmentUrls = [...attachmentUrls, ...newUrls];
    }

    return await prisma.travelNote.update({
      where: { id: noteId },
      data: { ...data, attachments: attachmentUrls },
      include: { section: true }
    });
  }

  async deleteNote(noteId, userId) {
    const note = await prisma.travelNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error('Note not found or unauthorized');

    // Delete from Cloudinary (optional but good practice)
    for (const url of note.attachments) {
      const publicId = url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`traveloop/notes/${publicId}`).catch(() => {});
    }

    return await prisma.travelNote.delete({ where: { id: noteId } });
  }

  async getNotesByDay(tripId, userId) {
    const notes = await prisma.travelNote.findMany({
      where: { tripId, userId },
      orderBy: { createdAt: 'asc' }
    });

    const grouped = notes.reduce((acc, note) => {
      const day = note.createdAt.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = { date: day, notes: [] };
      acc[day].notes.push(note);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  async getNotesBySection(tripId, userId) {
    const sections = await prisma.tripSection.findMany({
      where: { tripId },
      include: { 
        notes: { 
          where: { userId },
          orderBy: { createdAt: 'asc' }
        } 
      },
      orderBy: { sectionOrder: 'asc' }
    });

    return sections;
  }

  async _uploadFiles(files) {
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'traveloop/notes' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    return await Promise.all(uploadPromises);
  }
}

module.exports = new NoteService();
