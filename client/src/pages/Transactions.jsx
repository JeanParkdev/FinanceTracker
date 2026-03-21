import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions($month: Int, $year: Int) {
    transactions(month: $month, year: $year) {
      _id
      type
      amount
      category
      description
      date
      isRecurring
      recurringFreq
    }
  }
`;

const ADD_TRANSACTION = gql`
  mutation AddTransaction($type: String!, $amount: Float!, $category: String!, $description: String, $date: String, $isRecurring: Boolean, $recurringFreq: String) {
    addTransaction(type: $type, amount: $amount, category: $category, description: $description, date: $date, isRecurring: $isRecurring, recurringFreq: $recurringFreq) {
      _id
      type
      amount
      category
      description
      date
      isRecurring
      recurringFreq
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($_id: ID!) {
    deleteTransaction(_id: $_id) {
      _id
    }
  }
`;

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Subscriptions', 'Shopping', 'Entertainment', 'Income', 'Other'];

const today = new Date().toISOString().split('T')[0];
const emptyForm = { type: 'expense', amount: '', category: 'Food', description: '', date: today, isRecurring: false, recurringFreq: '' };

function Transactions() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, loading, refetch } = useQuery(GET_TRANSACTIONS, { variables: { month, year } });
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

  const transactions = data?.transactions || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form data:', form);
    console.log('date being sent:', form.date);
    try {
      await addTransaction({
        variables: {
          ...form,
          amount: parseFloat(form.amount),
          recurringFreq: form.isRecurring ? form.recurringFreq : null,
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
      await deleteTransaction({ variables: { _id: id } });
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
          Transactions
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <button onClick={prevMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>‹</button>
            <span>{monthName}</span>
            <button onClick={nextMonth} className="btn btn-outline" style={{ padding: '4px 10px' }}>›</button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + Add transaction
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div className="card-title">New transaction</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</label>
                <input type="number" name="amount" placeholder="0.00" value={form.amount} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
                <input type="text" name="description" placeholder="What was this for?" value={form.description} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="isRecurring" checked={form.isRecurring} onChange={handleChange} style={{ width: 'auto' }} />
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Recurring</label>
              </div>
              {form.isRecurring && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Frequency</label>
                  <select name="recurringFreq" value={form.recurringFreq} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
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
      ) : transactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px' }}>No transactions this month</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Click "Add transaction" to get started</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {transactions.map((t, i) => (
            <div key={t._id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < transactions.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {t.category[0]}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {t.description || t.category}
                    {t.isRecurring && (
                      <span style={{ marginLeft: '6px', fontSize: '10px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '99px' }}>
                        {t.recurringFreq}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {t.category} · {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;