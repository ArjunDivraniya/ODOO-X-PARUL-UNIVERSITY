import React, { useEffect, useMemo, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import { getExpenses } from '../../../api/tripTabs';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ExpenseRow } from '../../../components/dashboard/trip/ExpenseRow';
import CreateExpenseModal from '../../../components/dashboard/trip/CreateExpenseModal';
import EditExpenseModal from '../../../components/dashboard/trip/EditExpenseModal';
import { InvoicesSection } from '../../../components/dashboard/trip/InvoicesSection';

const CATEGORIES = ['ALL', 'HOTEL', 'FOOD', 'TRANSPORT', 'ACTIVITY', 'SHOPPING', 'OTHER'];

const ExpensesTab = ({ tripId }) => {
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [expenseRes, overviewRes] = await Promise.all([
          getExpenses(tripId),
          api.get(`/trips/${tripId}/overview`)
        ]);
        setExpenses(expenseRes.data.data.expenses || []);
        setOverview(overviewRes.data.data.overview || null);
      } catch (err) {
        toast.error('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return expenses;
    return expenses.filter((expense) => expense.category === filter);
  }, [expenses, filter]);

  const breakdown = useMemo(() => {
    const totals = {};
    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount || 0);
    });
    return totals;
  }, [expenses]);

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
          <h2 className="text-2xl font-heading font-bold text-secondary-bg">Expenses</h2>
          <p className="text-neutral-text text-sm">Track every spend and stay on budget.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">Total Spent</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">${overview.expensesSummary.total}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">Budget Remaining</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">${overview.expensesSummary.remaining}</div>
          </div>
          <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5">
            <div className="text-xs text-neutral-text mb-1">% Used</div>
            <div className="text-2xl font-heading font-bold text-secondary-bg">{overview.expensesSummary.percentageUsed}%</div>
          </div>
        </div>
      )}

      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6">
        <h3 className="text-lg font-heading font-bold text-secondary-bg mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.keys(breakdown).length === 0 && (
            <p className="text-sm text-neutral-text">No expenses recorded yet.</p>
          )}
          {Object.entries(breakdown).map(([category, amount]) => (
            <div key={category}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-text">{category}</span>
                <span className="text-secondary-bg">${amount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-accent-mint h-full rounded-full" style={{ width: `${Math.min((amount / (overview?.expensesSummary?.estimatedBudget || amount || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${
              filter === cat
                ? 'bg-accent-blue text-[#0A1622]'
                : 'bg-white/5 text-neutral-text hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          description="Add your first expense to keep budgets accurate."
          actionLabel="Add Expense"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onEdit={() => setEditingExpense(expense)}
              onDeleted={() => setExpenses(prev => prev.filter(item => item.id !== expense.id))}
              onUpdated={(updated) => setExpenses(prev => prev.map(item => item.id === updated.id ? updated : item))}
            />
          ))}
        </div>
      )}

      <InvoicesSection tripId={tripId} />

      {showCreate && (
        <CreateExpenseModal
          isOpen={showCreate}
          tripId={tripId}
          onClose={() => setShowCreate(false)}
          onCreated={(newExpense) => setExpenses(prev => [newExpense, ...prev])}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          isOpen={!!editingExpense}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdated={(updated) => setExpenses(prev => prev.map(item => item.id === updated.id ? updated : item))}
        />
      )}
    </div>
  );
};

export default ExpensesTab;
