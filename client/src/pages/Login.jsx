import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiJSON } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiJSON('/api/auth/login', {
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
          <p className="text-text-muted mt-1 text-sm tracking-widest uppercase">Enter. Eat. Ascend.</p>
        </div>

        <div className="bg-surface border border-border rounded" style={{ borderRadius: '6px' }}>
          <div className="p-8">
            <h2 className="font-display text-3xl text-text-primary mb-6 tracking-wide">ENTER THE ARENA</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs uppercase tracking-widest mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-bg border border-border text-text-primary px-4 py-3 rounded focus:outline-none focus:border-red-arena transition-colors"
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
                  className="w-full bg-bg border border-border text-text-primary px-4 py-3 rounded focus:outline-none focus:border-red-arena transition-colors"
                  style={{ borderRadius: '6px' }}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-arena text-sm bg-red-arena/10 border border-red-arena/20 px-4 py-3 rounded fade-in-up" style={{ borderRadius: '6px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-arena text-white font-display text-xl py-3 tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                style={{ borderRadius: '6px' }}
              >
                {loading ? 'ENTERING...' : 'ENTER THE ARENA'}
              </button>
            </form>

            <p className="text-text-muted text-sm text-center mt-6">
              No rank yet?{' '}
              <Link to="/register" className="text-amber hover:text-amber/80 transition-colors">
                Claim your title
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-surface/50 border border-border rounded text-center" style={{ borderRadius: '6px' }}>
          <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Demo Account</p>
          <p className="text-text-primary text-sm">demo@umamiarena.com / ramen123</p>
        </div>
      </div>
    </div>
  );
}
