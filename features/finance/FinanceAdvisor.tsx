
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Expense, Investment, FinancialAdvice } from '../../types';
import { getFinancialAdvice } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

const FinanceAdvisor: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '' });
  const [investmentForm, setInvestmentForm] = useState({ name: '', type: '', value: '' });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseForm.category && expenseForm.amount) {
      setExpenses([...expenses, { id: Date.now().toString(), category: expenseForm.category, amount: parseFloat(expenseForm.amount) }]);
      setExpenseForm({ category: '', amount: '' });
    }
  };

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (investmentForm.name && investmentForm.type && investmentForm.value) {
      setInvestments([...investments, { id: Date.now().toString(), name: investmentForm.name, type: investmentForm.type, value: parseFloat(investmentForm.value) }]);
      setInvestmentForm({ name: '', type: '', value: '' });
    }
  };

  const fetchAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getFinancialAdvice(expenses, investments);
      setAdvice(result);
    } catch (err) {
      setError('Failed to get financial advice. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    expenses.forEach(exp => {
      dataMap.set(exp.category, (dataMap.get(exp.category) || 0) + exp.amount);
    });
    return Array.from(dataMap, ([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card title="Manage Expenses">
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} placeholder="Category (e.g., Food)" className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500" />
            <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} placeholder="Amount" className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500" />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 md:col-span-1">Add Expense</button>
          </form>
          <ul className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {expenses.map(exp => (
              <li key={exp.id} className="flex justify-between bg-gray-700 p-2 rounded">
                <span>{exp.category}</span>
                <span>${exp.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card title="Track Investments">
          <form onSubmit={handleAddInvestment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" value={investmentForm.name} onChange={e => setInvestmentForm({...investmentForm, name: e.target.value})} placeholder="Name (e.g., VTSAX)" className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500 md:col-span-2" />
            <input type="text" value={investmentForm.type} onChange={e => setInvestmentForm({...investmentForm, type: e.target.value})} placeholder="Type (e.g., Index Fund)" className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500" />
            <input type="number" value={investmentForm.value} onChange={e => setInvestmentForm({...investmentForm, value: e.target.value})} placeholder="Value" className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500" />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 md:col-span-4">Add Investment</button>
          </form>
          <ul className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {investments.map(inv => (
              <li key={inv.id} className="flex justify-between bg-gray-700 p-2 rounded">
                <span>{inv.name} ({inv.type})</span>
                <span>${inv.value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        {chartData.length > 0 && (
          <Card title="Expense Breakdown">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #4b5563' }} />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-8">
         <Card title="AI Financial Advisor">
            <button onClick={fetchAdvice} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:bg-gray-500">
                {isLoading ? 'Getting Advice...' : 'Get AI-Powered Advice'}
            </button>
            {isLoading && <Spinner />}
            {error && <p className="text-red-400">{error}</p>}
            {advice && (
                <div className="space-y-6 mt-4">
                    <div>
                        <h4 className="font-semibold text-lg text-cyan-300 mb-2">Savings Suggestions</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {advice.savingsSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-cyan-300 mb-2">Tax Optimization</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {advice.taxOptimization.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default FinanceAdvisor;
