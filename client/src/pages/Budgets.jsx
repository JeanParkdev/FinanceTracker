import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_BUDGETS = gql`
  query GetBudgets($month: Int, $year: Int) {
    budgets(month: $month, year: $year) {
      _id
      category
      limit
      month
      year
      alertThreshold
    }
    transactions(month: $month, year: $year) {
      _id
      type
      amount
      category
    }
  }
`;

const SET_BUDGET = gql`
  mutation SetBudget($category: String!, $limit: Float!, $month: Int!, $year: Int!, $alertThreshold: Float) {
    setBudget(category: $category, limit: $limit, month: $month, year: $year, alertThreshold: $alertThreshold) {
      _id
      category
      limit
      month
      year
      alertThreshold
    }
  }
`;

const DELETE_BUDGET = gql`
  mutation DeleteBudget($_id: ID!) {
    deleteBudget(_id: $_id) {
      _id
    }
  }
`;

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Subscriptions', 'Shopping', 'Entertainment', 'Other'];

const emptyForm = { category: 'Food', limit: '', alertThreshold: '0.8' };

function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, loading, refetch } = useQuery(GET_BUDGETS, { variables: { month, year } });
  const [setBudget] = useMutation(SET_BUDGET);
  const [deleteBudget] = useMutation(DELETE_BUDGET);

  const budgets = data?.budgets || [];
  const transactions = data?.transactions || [];

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setBudget({
        variables: {
          ...form,
          limit: parseFloat(form.limit),
          month,
          year,
          alertThreshold: parseFloat(form.alertThreshold),
        }
      });
      setForm(emptyForm);
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget({ variables: { _id: id } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>
          Budgets
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <button onClick={prevMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>‹</button>
            <span>{monthName}</span>
            <button onClick={nextMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>›</button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + Add budget
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div className="card-title">New budget</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly limit</label>
                <input type="number" name="limit" placeholder="0.00" value={form.limit} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alert at</label>
                <select name="alertThreshold" value={form.alertThreshold} onChange={handleChange}>
                  <option value="0.5">50%</option>
                  <option value="0.7">70%</option>
                  <option value="0.8">80%</option>
                  <option value="0.9">90%</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : budgets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px' }}>No budgets yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Click "Add budget" to set spending limits</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {budgets.map(b => {
            const spent = categoryTotals[b.category] || 0;
            const pct = Math.min((spent / b.limit) * 100, 100);
            const isAlert = pct >= b.alertThreshold * 100;
            return (
              <div key={b._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{b.category}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Alert at {Math.round(b.alertThreshold * 100)}%</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', color: isAlert ? 'var(--danger)' : 'var(--text-primary)' }}>
                        ${spent.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>of ${b.limit.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => handleDelete(b._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: isAlert ? 'var(--danger)' : 'var(--accent)',
                    borderRadius: '99px',
                    transition: 'width 0.3s',
                  }}></div>
                </div>
                {isAlert && (
                  <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px' }}>
                    ⚠ You've used {Math.round(pct)}% of your {b.category} budget
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Budgets;