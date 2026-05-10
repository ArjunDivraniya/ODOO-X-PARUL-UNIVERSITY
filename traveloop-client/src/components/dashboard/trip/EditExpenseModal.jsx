import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { updateExpense } from '../../../api/tripTabs';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';

const CATEGORIES = ['HOTEL', 'FOOD', 'TRANSPORT', 'ACTIVITY', 'SHOPPING', 'OTHER'];

const EditExpenseModal = ({ isOpen, onClose, expense, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || 'HOTEL',
    expenseDate: expense?.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : '',
    description: expense?.description || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        expenseDate: formData.expenseDate ? new Date(formData.expenseDate).toISOString() : undefined,
        description: formData.description || undefined
      };
      const res = await updateExpense(expense.id, payload);
      onUpdated(res.data.data.expense);
      toast.success('Expense updated');
      onClose();
    } catch (err) {
      toast.error('Failed to update expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0A1622] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-xl">
              <div className="flex items-center justify-between p-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-heading font-bold text-secondary-bg">Edit Expense</h2>
                <button onClick={onClose} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category} className="bg-[#0A1622]">{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expenseDate">Expense Date</Label>
                    <Input id="expenseDate" name="expenseDate" type="date" value={formData.expenseDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-text hover:text-white rounded-[16px] text-sm font-medium transition-colors">Cancel</button>
                  <Button type="submit" disabled={submitting} className="min-w-[160px]">
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditExpenseModal;
