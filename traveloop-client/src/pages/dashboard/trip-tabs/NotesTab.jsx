import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { getNotes } from '../../../api/tripTabs';
import { EmptyState } from '../../../components/ui/EmptyState';
import { NoteCard } from '../../../components/dashboard/trip/NoteCard';
import CreateNoteModal from '../../../components/dashboard/trip/CreateNoteModal';
import EditNoteModal from '../../../components/dashboard/trip/EditNoteModal';

const NotesTab = ({ tripId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNotes(tripId);
        setNotes(res.data.data.notes || []);
      } catch (err) {
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-secondary-bg">Notes</h2>
          <p className="text-neutral-text text-sm">Capture ideas, links, and checklists.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Create notes for packing, reservations, or inspiration."
          actionLabel="Add Note"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDeleted={() => setNotes(prev => prev.filter(item => item.id !== note.id))}
              onUpdated={(updated) => setNotes(prev => prev.map(item => item.id === updated.id ? updated : item))}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateNoteModal
          isOpen={showCreate}
          tripId={tripId}
          onClose={() => setShowCreate(false)}
          onCreated={(newNote) => setNotes(prev => [newNote, ...prev])}
        />
      )}

      {editingNote && (
        <EditNoteModal
          isOpen={!!editingNote}
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onUpdated={(updated) => setNotes(prev => prev.map(item => item.id === updated.id ? updated : item))}
        />
      )}
    </div>
  );
};

export default NotesTab;
