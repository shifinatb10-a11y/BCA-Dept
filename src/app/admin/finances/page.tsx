'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Printer, 
  Filter, 
  Search, 
  Trash2, 
  Receipt, 
  Building, 
  PieChart, 
  CreditCard, 
  CheckCircle2, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { FinancialTransaction, BudgetAllocation, PaymentMethod, TransactionType, DepartmentEvent } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
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
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'ledger' | 'budgets' | 'analytics'>('ledger');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Form State: Transaction
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
    eventId: '',
    notes: '',
  });

  // Form State: Budget Setup
  const [budgetForm, setBudgetForm] = useState({
    fiscalYear: '2026-2027',
    title: '',
    allocatedAmount: '',
    category: 'Event Specific',
    notes: '',
  });

  const loadFinances = async () => {
    try {
      // Fetch data directly from Supabase tables (or API routes if preferred)
      const { data: txData, error: txError } = await supabase.from('finances').select('*').order('transaction_date', { ascending: false });
      const { data: budgetData, error: budgetError } = await supabase.from('budgets').select('*');
      const { data: evData, error: evError } = await supabase.from('events').select('*');

      if (txError) console.error(txError);
      if (budgetError) console.error(budgetError);

      const transactions: FinancialTransaction[] = (txData || []).map((t: any) => ({
        id: t.id,
        type: t.transaction_type,
        title: t.title,
        amount: Number(t.amount),
        date: t.transaction_date,
        category: t.category,
        paymentMethod: t.payment_method,
        payerPayee: t.party_name,
        receiptRef: t.reference_no,
        notes: t.notes,
        budgetId: t.budget_id,
        eventId: t.event_id,
      }));

      const budgets: BudgetAllocation[] = (budgetData || []).map((b: any) => ({
        id: b.id,
        fiscalYear: b.fiscal_year,
        title: b.title,
        allocatedAmount: Number(b.allocated_amount),
        spentAmount: Number(b.spent_amount || 0),
        category: b.category,
        notes: b.notes,
      }));

      // Calculate Summary metrics
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
        success: true,
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

      if (evData) setEvents(evData || []);
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
      eventId: '',
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
          budget_id: txForm.budgetId || null,
          event_id: txForm.eventId || null,
        },
      ]);

      if (error) throw error;

      // If tied to a budget, update spent amount
      if (txForm.type === 'expense' && txForm.budgetId) {
        const targetBudget = budgets.find((b) => b.id === txForm.budgetId);
        if (targetBudget) {
          await supabase
            .from('budgets')
            .update({ spent_amount: targetBudget.spentAmount + parseFloat(txForm.amount) })
            .eq('id', txForm.budgetId);
        }
      }

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
      alert('Failed to save budget setup: ' + err.message);
    }
  };

  const handleDeleteTx = async (id: string, title: string) => {
    if (!confirm(`Delete transaction "${title}"?`)) return;
    try {
      const { error } = await supabase.from('finances').delete().eq('id', id);
      if (error) throw error;
      loadFinances();
    } catch (err: any) {
      alert('Failed to delete transaction: ' + err.message);
    }
  };

  const handleDeleteBudget = async (id: string, title: string) => {
    if (!confirm(`Remove budget "${title}"?`)) return;
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
      loadFinances();
    } catch (err: any) {
      alert('Failed to delete budget: ' + err.message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!financesData?.transactions) return;
    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount (INR)', 'Payment Method', 'Payer/Payee', 'Receipt Ref', 'Notes'];
    const rows = financesData.transactions.map((t: FinancialTransaction) => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      `"${t.category}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.paymentMethod,
      `"${t.payerPayee.replace(/"/g, '""')}"`,
      `"${t.receiptRef || ''}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bca_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Statement
  const handlePrint = () => {
    window.print();
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
        tx.payerPayee.toLowerCase().includes(q) ||
        (tx.receiptRef && tx.receiptRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Financial Management System</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active Ledger
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Department Budget Allocation, Income Inflows, Voucher Expenses, and College Audit Records
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenTx('income')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Income</span>
          </button>

          <button
            onClick={() => handleOpenTx('expense')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Expense</span>
          </button>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Setup Budget</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export CSV Audit Ledger"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            title="Print Financial Statement"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Cash Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 shadow-blue-glow space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Department Cash Balance</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{summary.netBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-blue-300">
            Current net departmental liquidity
          </p>
        </div>

        {/* Total Inflow */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Total Inflow (Revenue)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{summary.totalIncome.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">
            Grants, sponsorships & registration dues
          </p>
        </div>

        {/* Total Outflow */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Total Outflow (Expenses)</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
            ₹{summary.totalExpense.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">
            Disbursed across {transactions.filter((t) => t.type === 'expense').length} vouchers
          </p>
        </div>

        {/* Budget Allocation Pool */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Allocated Budget</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{summary.totalBudgetAllocated.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Spent: ₹{summary.totalBudgetSpent.toLocaleString('en-IN')}</span>
            <span className="font-semibold text-cyan-400">{summary.utilizationPercentage}%</span>
          </div>
        </div>

      </div>

      {/* Main Tabs: Ledger vs Budgets vs Analytics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Transaction Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'budgets'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Budget Allocations ({budgets.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Category Analytics & Breakdown
          </button>
        </div>

        {/* Tab 1: Transaction Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            
            {/* Filter Sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-blue-900/40">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLedgerTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    ledgerTypeFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  All Transactions
                </button>
                <button
                  onClick={() => setLedgerTypeFilter('income')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    ledgerTypeFilter === 'income'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Income Inflows
                </button>
                <button
                  onClick={() => setLedgerTypeFilter('expense')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    ledgerTypeFilter === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Expenditures
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by title, party, receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-slate-900/80 border border-blue-900/40 overflow-hidden shadow-lg">
              {loading ? (
                <div className="py-16 text-center text-slate-400">Loading ledger...</div>
              ) : filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-blue-900/30 text-slate-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Transaction Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Payer / Payee</th>
                        <th className="py-3.5 px-4">Mode / Ref</th>
                        <th className="py-3.5 px-4 text-right">Amount (INR)</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                            {tx.date}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                                tx.type === 'income'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-red-950 text-red-300 border border-red-500/30'
                              }`}>
                                {tx.type}
                              </span>
                              <div>
                                <p className="font-bold text-white text-sm line-clamp-1">{tx.title}</p>
                                {tx.notes && <p className="text-[11px] text-slate-400 line-clamp-1">{tx.notes}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-200">{tx.payerPayee}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-white font-medium">{tx.paymentMethod}</div>
                            {tx.receiptRef && (
                              <div className="text-[10px] font-mono text-cyan-400 truncate max-w-[120px]">
                                {tx.receiptRef}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-sm whitespace-nowrap">
                            <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
                              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteTx(tx.id, tx.title)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">No transactions recorded under this view.</div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Budget Allocations */}
        {activeTab === 'budgets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Department Budget Allocations</h3>
                <p className="text-xs text-slate-400">Track spending against sanctioned allocations for academic sessions & tech fests.</p>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-blue-glow"
              >
                <Plus className="w-4 h-4" />
                <span>New Budget</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {budgets.map((b) => {
                const percent = b.allocatedAmount > 0 ? Math.min(100, Math.round((b.spentAmount / b.allocatedAmount) * 100)) : 0;
                const remaining = b.allocatedAmount - b.spentAmount;
                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 space-y-4 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/30">
                          {b.fiscalYear}
                        </span>
                        <button
                          onClick={() => handleDeleteBudget(b.id, b.title)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-white mt-2">{b.title}</h4>
                      {b.notes && <p className="text-xs text-slate-400 mt-1">{b.notes}</p>}
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Allocated:</span>
                        <span className="font-mono text-white font-bold">₹{b.allocatedAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Spent:</span>
                        <span className="font-mono text-red-400 font-bold">₹{b.spentAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Remaining Balance:</span>
                        <span className="font-mono text-emerald-400 font-bold">₹{remaining.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            percent > 85 ? 'bg-red-500' : percent > 50 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-semibold text-slate-400">{percent}% utilized</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Category Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Expenditure Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/40 space-y-4">
              <div className="flex items-center space-x-2 text-red-400 font-bold">
                <PieChart className="w-5 h-5" />
                <h3 className="text-base text-white">Expenditure by Category</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(summary.categoryBreakdown).map(([cat, amt]) => {
                  const amount = Number(amt);
                  const share = summary.totalExpense > 0 ? Math.round((amount / summary.totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat}</span>
                        <span className="font-mono text-slate-200">₹{amount.toLocaleString('en-IN')} ({share}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div className="bg-red-500/80 h-2 rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/40 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-base text-white">Income Sources & Collections</h3>
              </div>

              <div className="space-y-3">
                {Object.entries(summary.incomeBreakdown).map(([cat, amt]) => {
                  const amount = Number(amt);
                  const share = summary.totalIncome > 0 ? Math.round((amount / summary.totalIncome) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat}</span>
                        <span className="font-mono text-slate-200">₹{amount.toLocaleString('en-IN')} ({share}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div className="bg-emerald-500/80 h-2 rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-xl w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span>{txForm.type === 'income' ? 'Record Department Inflow / Income' : 'Record Expenditure / Voucher'}</span>
              </h2>
              <button onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTx} className="space-y-4 text-xs">
              
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxForm({ ...txForm, type: 'income', category: 'Event Registration' })}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    txForm.type === 'income'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  + Income (Inflow)
                </button>
                <button
                  type="button"
                  onClick={() => setTxForm({ ...txForm, type: 'expense', category: 'Refreshments' })}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    txForm.type === 'expense'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  - Expense (Outflow)
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Transaction Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ByteCraft 2026 Refreshments & Snacks"
                  value={txForm.title}
                  onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Amount (INR ₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 15000"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date *</label>
                  <input
                    type="date"
                    required
                    value={txForm.date}
                    onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    {(txForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Payment Method</label>
                  <select
                    value={txForm.paymentMethod}
                    onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    {txForm.type === 'income' ? 'Received From (Payer)' : 'Disbursed To (Payee / Vendor)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Council / Caterers"
                    value={txForm.payerPayee}
                    onChange={(e) => setTxForm({ ...txForm, payerPayee: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Receipt / Bill / UTR Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. BILL-9021 or UTR-2026-X"
                    value={txForm.receiptRef}
                    onChange={(e) => setTxForm({ ...txForm, receiptRef: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Link to budget allocation */}
              {txForm.type === 'expense' && budgets.length > 0 && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Deduct from Budget Pool (Optional)</label>
                  <select
                    value={txForm.budgetId}
                    onChange={(e) => setTxForm({ ...txForm, budgetId: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="">None / General Cash Pool</option>
                    {budgets.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} (₹{(b.allocatedAmount - b.spentAmount).toLocaleString('en-IN')} available)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Auditor Notes / Comments</label>
                <textarea
                  rows={2}
                  placeholder="Additional justifications or voucher notes..."
                  value={txForm.notes}
                  onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-lg ${
                    txForm.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  Record into Ledger
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Add Budget Setup Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-md w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-400" />
                <span>Create Department Budget Setup</span>
              </h2>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Budget Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Tech Symposium 2026-27"
                  value={budgetForm.title}
                  onChange={(e) => setBudgetForm({ ...budgetForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Fiscal Academic Year</label>
                  <input
                    type="text"
                    value={budgetForm.fiscalYear}
                    onChange={(e) => setBudgetForm({ ...budgetForm, fiscalYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Allocated Sum (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 75000"
                    value={budgetForm.allocatedAmount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, allocatedAmount: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Category</label>
                <select
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                >
                  <option value="Event Specific">Event Specific</option>
                  <option value="Department General Fund">Department General Fund</option>
                  <option value="Infrastructure & Labs">Infrastructure & Labs</option>
                  <option value="Student Development">Student Development</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Sanction Notes / Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Sanction authority or purpose breakdown..."
                  value={budgetForm.notes}
                  onChange={(e) => setBudgetForm({ ...budgetForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-blue-glow"
                >
                  Create Budget Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
