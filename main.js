import React, { useState } from 'react';
import { PlusCircle, Trash2, Settings, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('general');
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('dashboard');

  const categories = {
    general: 'כללי',
    food: 'מזון',
    transportation: 'תחבורה',
    housing: 'דיור',
    utilities: 'חשבונות',
    entertainment: 'בידור',
    healthcare: 'בריאות',
    savings: 'חסכונות'
  };

  const getTrendsData = () => {
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'];
    return months.map(month => ({
      name: month,
      הוצאות: Math.abs(transactions
        .filter(t => t.amount < 0)
        .reduce((acc, curr) => acc + curr.amount, 0)) / months.length,
      הכנסות: transactions
        .filter(t => t.amount > 0)
        .reduce((acc, curr) => acc + curr.amount, 0) / months.length
    }));
  };

  const addTransaction = () => {
    if (!description || !amount) return;
    const newTransaction = {
      id: Date.now(),
      description,
      amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
      category,
      date: new Date().toLocaleDateString('he-IL')
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount('');
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getIncome = () => {
    return transactions
      .filter(t => t.amount > 0)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getExpenses = () => {
    return Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((acc, curr) => acc + curr.amount, 0));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`p-2 rounded ${activeView === 'dashboard' ? 'bg-blue-500 text-white' : ''}`}
            >
              דשבורד
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`p-2 rounded ${activeView === 'analytics' ? 'bg-blue-500 text-white' : ''}`}
            >
              ניתוח נתונים
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">יתרה</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl text-center font-bold">
                    ₪{getBalance().toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">הכנסות</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl text-center font-bold text-green-600">
                    ₪{getIncome().toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">הוצאות</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl text-center font-bold text-red-600">
                    ₪{getExpenses().toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>הוספת תנועה חדשה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תיאור"
                    className="p-2 border rounded"
                    dir="rtl"
                  />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="סכום"
                    className="p-2 border rounded"
                    dir="rtl"
                  />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-2 border rounded"
                    dir="rtl"
                  >
                    <option value="expense">הוצאה</option>
                    <option value="income">הכנסה</option>
                  </select>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 border rounded"
                    dir="rtl"
                  >
                    {Object.entries(categories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                  <button
                    onClick={addTransaction}
                    className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    הוסף תנועה
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>היסטוריית תנועות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {categories[transaction.category]} | {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          ₪{transaction.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeView === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>מגמות הכנסות והוצאות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  width={800}
                  height={300}
                  data={getTrendsData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="הכנסות" stroke="#10B981" />
                  <Line type="monotone" dataKey="הוצאות" stroke="#EF4444" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
