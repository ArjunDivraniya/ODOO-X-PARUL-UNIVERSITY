import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getInvoices, createInvoice, updateInvoiceStatus } from '../../../api/tripTabs';
import { Badge } from '../../ui/Badge';

export const InvoicesSection = ({ tripId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subtotal: '', tax: '', discount: '', currency: 'USD', paymentMethod: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getInvoices(tripId);
        setInvoices(res.data.data.invoices || []);
      } catch (err) {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.subtotal) return toast.error('Subtotal is required');
    setSubmitting(true);

    try {
      const subtotal = Number(formData.subtotal);
      const tax = Number(formData.tax || 0);
      const discount = Number(formData.discount || 0);
      const total = subtotal + tax - discount;
      const payload = { tripId, subtotal, tax, discount, total, currency: formData.currency, paymentMethod: formData.paymentMethod || undefined };
      const res = await createInvoice(payload);
      setInvoices(prev => [res.data.data.invoice, ...prev]);
      setFormData({ subtotal: '', tax: '', discount: '', currency: 'USD', paymentMethod: '' });
      toast.success('Invoice created');
    } catch (err) {
      toast.error('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (invoiceId) => {
    try {
      const res = await updateInvoiceStatus(invoiceId, { status: 'PAID' });
      setInvoices(prev => prev.map(item => item.id === invoiceId ? res.data.data.invoice : item));
      toast.success('Invoice marked as paid');
    } catch (err) {
      toast.error('Failed to update invoice');
    }
  };

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 space-y-6">
      <div>
        <h3 className="text-lg font-heading font-bold text-secondary-bg">Invoices</h3>
        <p className="text-sm text-neutral-text">Generate invoices for trip expenses.</p>
      </div>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          name="subtotal"
          value={formData.subtotal}
          onChange={handleChange}
          placeholder="Subtotal"
          type="number"
          className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg focus:outline-none"
        />
        <input
          name="tax"
          value={formData.tax}
          onChange={handleChange}
          placeholder="Tax"
          type="number"
          className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg focus:outline-none"
        />
        <input
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount"
          type="number"
          className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg focus:outline-none"
        />
        <input
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          placeholder="Payment Method"
          className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-accent-blue text-[#0A1622] rounded-[12px] text-sm font-semibold"
        >
          {submitting ? 'Creating...' : 'Generate'}
        </button>
      </form>

      {loading ? (
        <div className="text-sm text-neutral-text">Loading invoices...</div>
      ) : (
        <div className="space-y-3">
          {invoices.length === 0 && (
            <div className="text-sm text-neutral-text">No invoices yet.</div>
          )}
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/5 border border-white/5 rounded-[16px] p-4">
              <div>
                <div className="text-sm font-semibold text-secondary-bg">{invoice.currency || 'USD'} {invoice.total}</div>
                <div className="text-xs text-neutral-text">Subtotal {invoice.subtotal} · Tax {invoice.tax || 0} · Discount {invoice.discount || 0}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={invoice.status === 'PAID' ? 'mint' : 'orange'}>{invoice.status || 'PENDING'}</Badge>
                {invoice.status !== 'PAID' && (
                  <button onClick={() => handleMarkPaid(invoice.id)} className="text-xs text-accent-blue">Mark paid</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
