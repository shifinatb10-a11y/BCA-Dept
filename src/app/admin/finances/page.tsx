'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Printer, 
  Search, 
  Trash2, 
  Building, 
  PieChart, 
  X
} from 'lucide-react';
import { FinancialTransaction, BudgetAllocation, PaymentMethod, TransactionType } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const INCOME_CATEGORIES = [
  'College Grant',
  'Event Registration',
  'Sponsorship',
  'Alumni Donation',
  'Workshop Fees',
  'Other Inflow',
];

const EXPENSE_CATEGORIES = [
  'Guest Honorarium',
  'Refreshments',
  'Prizes & Trophies',
  'Lab Equipment',
  'Banners & Printing',
  'Stage & Audio/Visual',
  'Certificates & Badges',
  'Travel & Logistics',
  'Software Licenses',
  'Miscellaneous',
];

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'Card'];

export default function AdminFinancesPage() {
  const [financesData, setFinancesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'ledger' | 'budgets' | 'analytics'>('ledger');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [txForm, setTxForm] = useState({
    title: '',
    type: 'expense' as TransactionType,
    category: 'Refreshments',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as PaymentMethod,
    payerPayee: '',
    receiptRef: '',
    budgetId: '',
    notes: '',
  });

  const [budgetForm, setBudgetForm] = useState({
    fiscalYear: '2026-2027',
    title: '',
    allocatedAmount: '',
    category: 'Event Specific',
    notes: '',
  });

  const loadFinances = async () => {
    try {
      const { data: txData, error: txError } = await supabase.from('finances').select('*');
      const { data: budgetData, error: budgetError } = await supabase.from('budgets').select('*');

      if (txError) console.error(txError);
      if (budgetError) console.error(budgetError);

      const transactions: FinancialTransaction[] = (txData || []).map((t: any) => ({
        id: t.id,
        type: t.transaction_type || t.type,
        title: t.title,
        amount: Number(t.amount || 0),
        date: t.transaction_date || t.date,
        category: t.category,
        paymentMethod: t.payment_method || t.paymentMethod,
        payerPayee: t.party_name || t.payer || '',
        receiptRef: t.reference_no || t.reference || '',
        notes: t.notes || '',
        budgetId: t.budget_id,
        status: 'completed',
        createdAt: t.created_at || new Date().toISOString(),
      }));

      const budgets: BudgetAllocation[] = (budgetData || []).map((b: any) => ({
        id: b.id,
        fiscalYear: b.fiscal_year || '2026-2027',
        title: b.title,
        allocatedAmount: Number(b.allocated_amount || 0),
        spentAmount: Number(b.spent_amount || 0),
        category: b.category,
        notes: b.notes,
      }));

      let totalIncome = 0;
      let totalExpense = 0;
      let categoryBreakdown: Record<string, number> = {};
      let incomeBreakdown: Record<string, number> = {};

      transactions.forEach((tx) => {
        if (tx.type === 'income') {
          totalIncome += tx.amount;
          incomeBreakdown[tx.category] = (incomeBreakdown[tx.category] || 0) + tx.amount;
        } else {
          totalExpense += tx.amount;
          categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
        }
      });

      const netBalance = totalIncome - totalExpense;
      const totalBudgetAllocated = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
      const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
      const utilizationPercentage = totalBudgetAllocated > 0 ? Math.round((totalBudgetSpent / totalBudgetAllocated) * 100) : 0;

      setFinancesData({
        summary: {
          totalIncome,
          totalExpense,
          netBalance,
          totalBudgetAllocated,
          totalBudgetSpent,
          utilizationPercentage,
          categoryBreakdown,
          incomeBreakdown,
        },
        transactions,
        budgets,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinances();
  }, []);

  const handleOpenTx = (type: TransactionType = 'expense') => {
    setTxForm({
      title: '',
      type,
      category: type === 'income' ? 'Event Registration' : 'Refreshments',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      payerPayee: '',
      receiptRef: '',
      budgetId: '',
      notes: '',
    });
    setIsTxModalOpen(true);
  };

  const handleSaveTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.title || !txForm.amount) {
      alert('Please fill all required transaction fields');
      return;
    }

    try {
      const { error } = await supabase.from('finances').insert([
        {
          transaction_type: txForm.type,
          title: txForm.title,
          amount: parseFloat(txForm.amount),
          transaction_date: txForm.date,
          category: txForm.category,
          payment_method: txForm.paymentMethod,
          party_name: txForm.payerPayee,
          reference_no: txForm.receiptRef,
          notes: txForm.notes,
        },
      ]);

      if (error) throw error;

      setIsTxModalOpen(false);
      loadFinances();
    } catch (err: any) {
      alert('Failed to save transaction: ' + err.message);
    }
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetForm.title || !budgetForm.allocatedAmount) {
      alert('Please specify budget title and allocated sum');
      return;
    }

    try {
      const { error } = await supabase.from('budgets').insert([
        {
          fiscal_year: budgetForm.fiscalYear,
          title: budgetForm.title,
          allocated_amount: parseFloat(budgetForm.allocatedAmount),
          spent_amount: 0,
          category: budgetForm.category,
          notes: budgetForm.notes,
        },
      ]);

      if (error) throw error;

      setIsBudgetModalOpen(false);
      setBudgetForm({
        fiscalYear: '2026-2027',
        title: '',
        allocatedAmount: '',
        category: 'Event Specific',
        notes: '',
      });
      loadFinances();
    } catch (err: any) {
      alert('Failed to save budget: ' + err.message);
    }
  };

  const handleDeleteTx = async (id: string, title: string) => {
    if (!confirm(`Delete transaction "${title}"?`)) return;
    try {
      const { error } = await supabase.from('finances').delete().eq('id', id);
      if (error) throw error;
      loadFinances();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleDeleteBudget = async (id: string, title: string) => {
    if (!confirm(`Remove budget "${title}"?`)) return;
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
      loadFinances();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const summary = financesData?.summary || {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    totalBudgetAllocated: 0,
    totalBudgetSpent: 0,
    utilizationPercentage: 0,
    categoryBreakdown: {},
    incomeBreakdown: {},
  };

  const transactions: FinancialTransaction[] = financesData?.transactions || [];
  const budgets: BudgetAllocation[] = financesData?.budgets || [];

  const filteredTransactions = transactions.filter((tx) => {
    if (ledgerTypeFilter !== 'all' && tx.type !== ledgerTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.payerPayee.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Financial Management System</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Department Budget Allocation, Income Inflows, Voucher Expenses, and College Audit Records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenTx('income')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Income</span>
          </button>

          <button
            onClick={() => handleOpenTx('expense')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Expense</span>
          </button>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Setup Budget</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Department Cash Balance</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{summary.netBalance.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Inflow (Revenue)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{summary.totalIncome.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-500/30 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Outflow (Expenses)</span>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
            ₹{summary.totalExpense.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Allocated Budget</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{summary.totalBudgetAllocated.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Spent: ₹{summary.totalBudgetSpent.toLocaleString('en-IN')}</span>
            <span className="text-cyan-400">{summary.utilizationPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'ledger' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Transaction Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'budgets' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Budget Allocations ({budgets.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Analytics & Breakdown
          </button>
        </div>

        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-2xl border border-blue-900/40">
              <div className="flex space-x-2">
                <button onClick={() => setLedgerTypeFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${ledgerTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>All</button>
                <button onClick={() => setLedgerTypeFilter('income')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${ledgerTypeFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Income</button>
                <button onClick={() => setLedgerTypeFilter('expense')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${ledgerTypeFilter === 'expense' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>Expenses</button>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
              />
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-blue-900/40 overflow-hidden shadow-lg">
              {loading ? (
                <div className="py-16 text-center text-slate-400">Loading ledger...</div>
              ) : filteredTransactions.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Mode</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{tx.date}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{tx.title}</td>
                        <td className="py-3.5 px-4">{tx.category}</td>
                        <td className="py-3.5 px-4">{tx.paymentMethod}</td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => handleDeleteTx(tx.id, tx.title)} className="p-1 rounded bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-white">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400">No transactions recorded.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Budgets</h3>
              <button onClick={() => setIsBudgetModalOpen(true)} className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">New Budget</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {budgets.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-slate-900 border border-blue-900/40 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300">{b.fiscalYear}</span>
                      <button onClick={() => handleDeleteBudget(b.id, b.title)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <h4 className="text-base font-bold text-white mt-2">{b.title}</h4>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Allocated:</span><span className="font-mono text-white">₹{b.allocatedAmount.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Spent:</span><span className="font-mono text-red-400">₹{b.spentAmount.toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-blue-900/40 space-y-4">
              <h3 className="text-base font-bold text-white">Expenditure Breakdown</h3>
              {Object.entries(summary.categoryBreakdown).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between text-xs text-slate-300">
                  <span>{cat}</span>
                  <span className="font-mono">₹{Number(amt).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="max-w-xl w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Record Transaction</h2>
              <button onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setTxForm({ ...txForm, type: 'income' })} className={`py-2 rounded-xl font-bold ${txForm.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}>Income</button>
                <button type="button" onClick={() => setTxForm({ ...txForm, type: 'expense' })} className={`py-2 rounded-xl font-bold ${txForm.type === 'expense' ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-400'}`}>Expense</button>
              </div>
              <input type="text" required placeholder="Title" value={txForm.title} onChange={(e) => setTxForm({ ...txForm, title: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs" />
              <input type="number" required placeholder="Amount" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono" />
              <input type="date" required value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs" />
              <select value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs">
                {(txForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsTxModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="max-w-md w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Setup Budget</h2>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <input type="text" required placeholder="Budget Title (e.g. Tech Fest)" value={budgetForm.title} onChange={(e) => setBudgetForm({ ...budgetForm, title: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs" />
              <input type="number" required placeholder="Allocated Amount" value={budgetForm.allocatedAmount} onChange={(e) => setBudgetForm({ ...budgetForm, allocatedAmount: e.target.value })} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono" />
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Create Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
