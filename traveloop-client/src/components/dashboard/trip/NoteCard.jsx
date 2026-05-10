import React from 'react';
import { LuFileText, LuSquareCheck, LuLink, LuPencil, LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { deleteNote } from '../../../api/tripTabs';
import { Badge } from '../../ui/Badge';

const NOTE_ICON = {
  TEXT: LuFileText,
  CHECKLIST: LuSquareCheck,
  LINK: LuLink
};

export const NoteCard = ({ note, onEdit, onDeleted, onUpdated }) => {
  const Icon = NOTE_ICON[note.noteType] || LuFileText;

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(note.id);
      onDeleted();
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="break-inside-avoid bg-[#0A1622] border border-white/5 rounded-[20px] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Badge tone="blue">{note.noteType || 'TEXT'}</Badge>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white">
            <LuPencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 bg-red-500/20 rounded-[12px] text-red-300 hover:text-red-200">
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-heading font-bold text-secondary-bg">{note.title}</h4>
        <p className="text-sm text-neutral-text mt-2 whitespace-pre-line">{note.content}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-text">
        <Icon className="w-3 h-3" /> {note.noteType || 'TEXT'}
      </div>
    </div>
  );
};
