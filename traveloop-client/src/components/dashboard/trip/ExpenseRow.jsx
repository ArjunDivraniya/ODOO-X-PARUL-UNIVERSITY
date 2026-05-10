import React from 'react';
import { LuCalendar, LuPencil, LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { deleteExpense } from '../../../api/tripTabs';
import { Badge } from '../../ui/Badge';
import { format } from 'date-fns';

export const ExpenseRow = ({ expense, onEdit, onDeleted, onUpdated }) => {
  const handleDelete = async () => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expense.id);
      onDeleted();
      toast.success('Expense deleted');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[18px] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-start gap-3">
        <Badge tone="mint">{expense.category}</Badge>
        <div>
          <div className="text-sm font-semibold text-secondary-bg">{expense.title}</div>
          {expense.description && <div className="text-xs text-neutral-text mt-1">{expense.description}</div>}
          {expense.expenseDate && (
            <div className="flex items-center gap-2 text-xs text-neutral-text mt-1">
              <LuCalendar className="w-3 h-3" /> {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4">
        <div className="text-sm font-semibold text-secondary-bg">${Number(expense.amount).toFixed(2)}</div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white/5 rounded-[12px] text-neutral-text hover:text-white">
            <LuPencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 bg-red-500/20 rounded-[12px] text-red-300 hover:text-red-200">
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
