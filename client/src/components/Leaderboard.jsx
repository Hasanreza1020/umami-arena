import { useState, useEffect } from 'react';
import { apiJSON } from '../api';

const LEVEL_TITLES = ['Unranked', 'Genin', 'Ramen Apprentice', 'Broth Samurai', 'Umami Oni', 'The Ramen God'];
const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ currentUserId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJSON('/api/leaderboard')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-border p-6" style={{ borderRadius: '6px' }}>
        <p className="text-text-muted text-xs uppercase tracking-widest animate-pulse">Loading standings...</p>
      </div>
    );
  }

  if (!data) return null;

  const { top10, userEntry, userRank } = data;
  const userInTop10 = top10.some((u) => u.id === currentUserId);

  function renderRow(user, rank, isCurrentUser) {
    const medal = MEDALS[rank - 1] || null;
    const isVip = user.current_level >= 4;
    const title = LEVEL_TITLES[user.current_level] || 'Unranked';

    return (
      <tr
        key={user.id}
        style={{
          background: isCurrentUser ? '#200808' : 'transparent',
          borderLeft: isCurrentUser ? '3px solid #E8332A' : '3px solid transparent',
        }}
      >
        <td className="py-3 px-4 font-display text-xl" style={{ color: medal ? undefined : '#9A9A8A', width: 60 }}>
          {medal || `#${rank}`}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-semibold text-sm">{user.name}</span>
            {isVip && (
              <span
                className="text-xs px-2 py-0.5 bg-red-arena/20 text-red-arena border border-red-arena/30 font-semibold"
                style={{ borderRadius: '4px' }}
              >
                VIP
              </span>
            )}
            {isCurrentUser && (
              <span className="text-xs text-amber">(you)</span>
            )}
          </div>
        </td>
        <td className="py-3 px-4 text-text-muted text-xs hidden sm:table-cell">{title}</td>
        <td className="py-3 px-4 font-display text-xl text-red-arena">{user.total_packs}</td>
        <td className="py-3 px-4 text-text-primary text-sm">
          {user.current_streak > 0 ? `🔥 ${user.current_streak}` : '—'}
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-surface border border-border p-6" style={{ borderRadius: '6px' }}>
      <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Rankings</p>
      <h2 className="font-display text-2xl text-text-primary tracking-wide mb-4">ARENA STANDINGS</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left text-text-muted text-xs uppercase tracking-widest">Rank</th>
              <th className="py-2 px-4 text-left text-text-muted text-xs uppercase tracking-widest">Name</th>
              <th className="py-2 px-4 text-left text-text-muted text-xs uppercase tracking-widest hidden sm:table-cell">Title</th>
              <th className="py-2 px-4 text-left text-text-muted text-xs uppercase tracking-widest">Packs</th>
              <th className="py-2 px-4 text-left text-text-muted text-xs uppercase tracking-widest">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {top10.map((user, i) => renderRow(user, i + 1, user.id === currentUserId))}

            {!userInTop10 && userEntry && (
              <>
                <tr>
                  <td colSpan={5} className="py-2 px-4 text-center">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-text-muted text-xs">Your rank</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  </td>
                </tr>
                {renderRow({ ...userEntry, name: `You` }, userRank, true)}
              </>
            )}
          </tbody>
        </table>
      </div>

      {top10.length === 0 && (
        <p className="text-text-muted text-center py-8">No warriors yet. Be the first!</p>
      )}
    </div>
  );
}
