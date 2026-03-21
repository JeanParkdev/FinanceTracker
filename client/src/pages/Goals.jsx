import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_GOALS = gql`
  query GetGoals {
    goals {
      _id
      name
      targetAmount
      currentAmount
      targetDate
      isComplete
      notes
    }
  }
`;

const ADD_GOAL = gql`
  mutation AddGoal($name: String!, $targetAmount: Float!, $currentAmount: Float, $targetDate: String, $notes: String) {
    addGoal(name: $name, targetAmount: $targetAmount, currentAmount: $currentAmount, targetDate: $targetDate, notes: $notes) {
      _id
      name
      targetAmount
      currentAmount
      targetDate
      isComplete
      notes
    }
  }
`;

const UPDATE_GOAL = gql`
  mutation UpdateGoal($_id: ID!, $currentAmount: Float, $isComplete: Boolean) {
    updateGoal(_id: $_id, currentAmount: $currentAmount, isComplete: $isComplete) {
      _id
      name
      targetAmount
      currentAmount
      isComplete
    }
  }
`;

const DELETE_GOAL = gql`
  mutation DeleteGoal($_id: ID!) {
    deleteGoal(_id: $_id) {
      _id
    }
  }
`;

const emptyForm = { name: '', targetAmount: '', currentAmount: '0', targetDate: '', notes: '' };

function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, loading, refetch } = useQuery(GET_GOALS);
  const [addGoal] = useMutation(ADD_GOAL);
  const [updateGoal] = useMutation(UPDATE_GOAL);
  const [deleteGoal] = useMutation(DELETE_GOAL);

  const goals = data?.goals || [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGoal({
        variables: {
          ...form,
          targetAmount: parseFloat(form.targetAmount),
          currentAmount: parseFloat(form.currentAmount) || 0,
        }
      });
      setForm(emptyForm);
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFunds = async (goal, amount) => {
    const newAmount = goal.currentAmount + amount;
    const isComplete = newAmount >= goal.targetAmount;
    try {
      await updateGoal({
        variables: { _id: goal._id, currentAmount: newAmount, isComplete }
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal({ variables: { _id: id } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>
          Goals
        </h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          + Add goal
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div className="card-title">New goal</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Goal name</label>
                <input type="text" name="name" placeholder="e.g. Emergency Fund" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target amount</label>
                <input type="number" name="targetAmount" placeholder="0.00" value={form.targetAmount} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starting amount</label>
                <input type="number" name="currentAmount" placeholder="0.00" value={form.currentAmount} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target date</label>
                <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</label>
                <input type="text" name="notes" placeholder="Optional notes" value={form.notes} onChange={handleChange} />
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
      ) : goals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px' }}>No goals yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Click "Add goal" to start saving towards something</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {goals.map(g => {
            const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
            const remaining = g.targetAmount - g.currentAmount;
            return (
              <div key={g._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{g.name}</div>
                      {g.isComplete && (
                        <span style={{ fontSize: '11px', background: 'var(--bg-tertiary)', color: 'var(--success)', padding: '2px 8px', borderRadius: '99px', fontWeight: '500' }}>
                          Complete
                        </span>
                      )}
                    </div>
                    {g.notes && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{g.notes}</div>}
                    {g.targetDate && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Target: {new Date(g.targetDate).toLocaleDateString()}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(g._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>${g.currentAmount.toLocaleString()} saved</span>
                  <span>${g.targetAmount.toLocaleString()} goal</span>
                </div>

                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: g.isComplete ? 'var(--success)' : 'var(--accent)',
                    borderRadius: '99px',
                    transition: 'width 0.3s',
                  }}></div>
                </div>

                {!g.isComplete && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${remaining.toLocaleString()} to go</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                      {[10, 50, 100, 500].map(amount => (
                        <button
                          key={amount}
                          onClick={() => handleAddFunds(g, amount)}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>
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

export default Goals;