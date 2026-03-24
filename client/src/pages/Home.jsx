import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ background: '#fff5f7', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2.5rem',
        background: '#fff',
        borderBottom: '0.5px solid #ffd6e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#c9909f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>✦ your money</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '600', color: '#2d0a15' }}>Finance Tracker</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" style={{ fontSize: '13px', color: '#8b4a5a', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/register" style={{
            fontSize: '13px',
            background: '#b5546a',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
          }}>Get started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
        padding: '5rem 2.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fff',
            border: '0.5px solid #ffd6e0',
            borderRadius: '99px',
            padding: '5px 14px',
            fontSize: '11px',
            color: '#b5546a',
            letterSpacing: '0.05em',
            marginBottom: '1.25rem',
          }}>
            ✦ your money, your power
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '48px',
            fontWeight: '700',
            color: '#2d0a15',
            lineHeight: '1.15',
            marginBottom: '1rem',
          }}>
            Money management<br/>that feels like{' '}
            <em style={{ color: '#b5546a' }}>self care.</em>
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#8b4a5a',
            lineHeight: '1.8',
            marginBottom: '2rem',
            maxWidth: '420px',
          }}>
            Track your spending, set budgets that actually stick, and build toward the life you want — all in one beautiful place.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/register" style={{
              background: '#b5546a',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
            }}>
              Start for free ✦
            </Link>
            <Link to="/login" style={{
              background: '#fff',
              color: '#b5546a',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              border: '1px solid #ffd6e0',
              textDecoration: 'none',
            }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Mini dashboard preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#fff', border: '0.5px solid #ffd6e0', borderRadius: '14px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#c9909f', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saved this month</span>
              <span style={{ fontSize: '11px', color: '#b5546a' }}>↑ 12%</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '600', color: '#2d0a15' }}>$2,058</div>
            <div style={{ fontSize: '12px', color: '#b5546a', marginTop: '4px' }}>39% savings rate ✦</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#fff', border: '0.5px solid #ffd6e0', borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: '#c9909f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Food budget</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: '#2d0a15' }}>$234 / $300</div>
              <div style={{ height: '4px', background: '#fff0f3', borderRadius: '99px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ height: '100%', width: '78%', background: '#b5546a', borderRadius: '99px' }}></div>
              </div>
            </div>
            <div style={{ background: '#fff', border: '0.5px solid #ffd6e0', borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: '#c9909f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Vacation goal</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: '#2d0a15' }}>$800 / $2k</div>
              <div style={{ height: '4px', background: '#fff0f3', borderRadius: '99px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ height: '100%', width: '40%', background: '#c9909f', borderRadius: '99px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '0 2.5rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '600', color: '#2d0a15' }}>
            Everything you need to <em style={{ color: '#b5546a' }}>thrive.</em>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { num: '01', title: 'Track every dollar', desc: 'Log income and expenses by category. See exactly where your money goes each month with beautiful charts.' },
            { num: '02', title: 'Set smart budgets', desc: 'Create monthly spending limits with custom alerts so you always know before you overspend.' },
            { num: '03', title: 'Reach your goals', desc: 'Build savings goals and watch your progress grow — one intentional dollar at a time.' },
          ].map(f => (
            <div key={f.num} style={{ background: '#fff', border: '0.5px solid #ffd6e0', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: '#ffd6e0', marginBottom: '12px' }}>{f.num}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '600', color: '#2d0a15', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#8b4a5a', lineHeight: '1.7' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: '#b5546a',
        padding: '4rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
          Ready to take control?
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
          Join thousands of people building healthier financial habits.
        </p>
        <Link to="/register" style={{
          background: '#fff',
          color: '#b5546a',
          padding: '12px 28px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Start for free ✦
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        background: '#fff',
        borderTop: '0.5px solid #ffd6e0',
        padding: '1.5rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontStyle: 'italic', color: '#c9909f' }}>
          "financial freedom is self care" ✦
        </div>
        <div style={{ fontSize: '12px', color: '#c9909f' }}>Built with love ✦</div>
      </div>
    </div>
  );
}

export default Home;