import { useState } from 'react';
import { apiJSON } from '../api';

export default function CodeEntry({ onRedemption }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const result = await apiJSON('/api/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      setStatus({ type: 'success', message: result.message });
      setCode('');
      if (onRedemption) onRedemption(result);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border p-6 md:p-8" style={{ borderRadius: '6px' }}>
      <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Code Redemption</p>
      <h2 className="font-display text-3xl text-text-primary tracking-wide mb-6">LOG YOUR PACK</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="UMA-XXXX-XXXX"
          className="flex-1 bg-bg border border-border text-text-primary px-4 py-3 font-mono text-lg focus:outline-none focus:border-red-arena transition-colors tracking-widest"
          style={{ borderRadius: '6px' }}
          maxLength={12}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="bg-red-arena text-white font-display text-xl px-8 py-3 tracking-widest hover:bg-red-600 transition-colors disabled:opacity-40 shrink-0"
          style={{ borderRadius: '6px' }}
        >
          {loading ? 'LOGGING...' : 'ENTER THE ARENA'}
        </button>
      </form>

      {status && (
        <div
          key={status.message}
          className={`mt-4 px-4 py-3 text-sm fade-in-up border ${
            status.type === 'success'
              ? 'bg-green-900/20 border-green-700/30 text-green-400'
              : 'bg-red-arena/10 border-red-arena/20 text-red-arena'
          }`}
          style={{ borderRadius: '6px' }}
        >
          {status.type === 'success' ? '✓ ' : '✗ '}
          {status.message}
        </div>
      )}
    </div>
  );
}
