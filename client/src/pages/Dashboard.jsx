import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const GET_DASHBOARD = gql`
  query GetDashboard($month: Int, $year: Int) {
    transactions(month: $month, year: $year) {
      _id
      type
      amount
      category
      description
      date
      isRecurring
    }
    budgets(month: $month, year: $year) {
      _id
      category
      limit
      alertThreshold
    }
    goals {
      _id
      name
      targetAmount
      currentAmount
      isComplete
    }
  }
`;
const CATEGORY_COLORS = {
  Housing: '#b5546a',
  Food: '#e8956d',
  Transport: '#d4456b',
  Subscriptions: '#c9909f',
  Shopping: '#8b4a5a',
  Entertainment: '#ff8fab',
  Other: '#ffd6e0',
};

function MetricCard({ label, value, change, changeUp }) {
  return (
    <div className="card" style={{ padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' }}>
        {value}
      </div>
      {change && (
        <div style={{ fontSize: '11px', marginTop: '4px', color: changeUp ? 'var(--success)' : 'var(--danger)' }}>
          {change}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const prevMonth = () => {
    if (month === 1) { 
      setMonth(12); setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 12) { 
      setMonth(1); setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const { data, loading, error } = useQuery(GET_DASHBOARD, {
    variables: { month, year },
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px' }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: 'var(--danger)' }}>Something went wrong.</p>
    </div>
  );

  const transactions = data?.transactions || [];
  const budgets = data?.budgets || [];
  const goals = data?.goals || [];

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const saved = income - expenses;
  const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0;

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const budgetAlerts = budgets.filter(b => {
    const spent = categoryTotals[b.category] || 0;
    return spent / b.limit >= b.alertThreshold;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <button onClick={prevMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>‹</button>
          <span>{monthName}</span>
        <button onClick={nextMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>›</button>
      </div>
    </div>

      {budgetAlerts.length > 0 && (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '1.5rem',
          fontSize: '13px',
          color: 'var(--danger)',
        }}>
          ⚠ Budget alert: {budgetAlerts.map(b => b.category).join(', ')} {budgetAlerts.length === 1 ? 'is' : 'are'} close to the limit
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
        <MetricCard label="Income" value={`$${income.toLocaleString()}`} change={`this month`} changeUp={true} />
        <MetricCard label="Expenses" value={`$${expenses.toLocaleString()}`} change={`this month`} changeUp={false} />
        <MetricCard label="Saved" value={`$${saved.toLocaleString()}`} change={`${savingsRate}% savings rate`} changeUp={saved >= 0} />
        <MetricCard label="Goals" value={`${goals.filter(g => g.isComplete).length} / ${goals.length}`} change="completed" changeUp={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Spending by category</div>
          {pieData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No expenses this month</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={CATEGORY_COLORS[entry.name] || '#ffd6e0'} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-title">Recent transactions</div>
          {recentTransactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No transactions this month</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentTransactions.map(t => (
                <div key={t._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '0.5px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{t.description || t.category}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.category} · {new Date(t.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '600',
                    color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {budgets.length > 0 && (
        <div className="card">
          <div className="card-title">Budget progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgets.map(b => {
              const spent = categoryTotals[b.category] || 0;
              const pct = Math.min((spent / b.limit) * 100, 100);
              const isAlert = pct >= b.alertThreshold * 100;
              return (
                <div key={b._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>{b.category}</span>
                    <span style={{ color: isAlert ? 'var(--danger)' : 'var(--text-muted)' }}>${spent.toLocaleString()} / ${b.limit.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: isAlert ? 'var(--danger)' : 'var(--accent)', borderRadius: '99px', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;