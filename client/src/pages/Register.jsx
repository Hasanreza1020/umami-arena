import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiJSON } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiJSON('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      localStorage.setItem('ua_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-6xl text-red-arena tracking-wider">UMAMI ARENA</h1>
          <p className="text-text-muted mt-1 text-sm tracking-widest uppercase">Claim your rank</p>
        </div>

        <div className="bg-surface border border-border" style={{ borderRadius: '6px' }}>
          <div className="p-8">
            <h2 className="font-display text-3xl text-text-primary mb-6 tracking-wide">CREATE WARRIOR</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs uppercase tracking-widest mb-1">Arena Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-bg border border-border text-text-primary px-4 py-3 focus:outline-none focus:border-red-arena transition-colors"
                  style={{ borderRadius: '6px' }}
                  placeholder="Your warrior name"
                  required
                />
              </div>

              <div>
                <label className="block text-text-muted text-xs uppercase tracking-widest mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-bg border border-border text-text-primary px-4 py-3 focus:outline-none focus:border-red-arena transition-colors"
                  style={{ borderRadius: '6px' }}
                  placeholder="warrior@arena.com"
                  required
                />
              </div>

              <div>
                <label className="block text-text-muted text-xs uppercase tracking-widest mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-bg border border-border text-text-primary px-4 py-3 focus:outline-none focus:border-red-arena transition-colors"
                  style={{ borderRadius: '6px' }}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="text-red-arena text-sm bg-red-arena/10 border border-red-arena/20 px-4 py-3 fade-in-up" style={{ borderRadius: '6px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-arena text-white font-display text-xl py-3 tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                style={{ borderRadius: '6px' }}
              >
                {loading ? 'ENTERING...' : 'CLAIM YOUR RANK'}
              </button>
            </form>

            <p className="text-text-muted text-sm text-center mt-6">
              Already ranked?{' '}
              <Link to="/login" className="text-amber hover:text-amber/80 transition-colors">
                Enter the arena
              </Link>
            </p>

            <p className="text-center mt-3">
              <Link to="/dashboard" className="text-text-muted text-xs hover:text-text-primary transition-colors">
                ← Back to arena
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
