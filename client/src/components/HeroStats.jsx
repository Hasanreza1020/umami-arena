const LEVELS = [
  { level: 0, title: 'Unranked', roman: '—', color: '#9A9A8A' },
  { level: 1, title: 'Genin', roman: 'I', color: '#9A9A8A' },
  { level: 2, title: 'Ramen Apprentice', roman: 'II', color: '#F5A623' },
  { level: 3, title: 'Broth Samurai', roman: 'III', color: '#F5A623' },
  { level: 4, title: 'Umami Oni', roman: 'IV', color: '#E8332A' },
  { level: 5, title: 'The Ramen God', roman: 'V', color: '#E8332A' },
];

function LevelBadge({ level }) {
  const info = LEVELS[level] || LEVELS[0];
  const isElite = level >= 4;

  return (
    <div
      className={`relative flex flex-col items-center ${isElite ? 'pulse-glow' : ''}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 120,
          height: 120,
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          background: isElite
            ? 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 50%, #1a0a0a 100%)'
            : 'linear-gradient(135deg, #1A1A1A 0%, #222 50%, #1A1A1A 100%)',
          border: isElite ? '2px solid #E8332A' : '2px solid #2A2A2A',
          boxShadow: isElite ? '0 0 20px rgba(232,51,42,0.4)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            border: isElite ? '2px solid #E8332A' : '2px solid #2A2A2A',
          }}
        />
        <span
          className="font-display text-4xl"
          style={{ color: info.color, letterSpacing: '0.05em' }}
        >
          {info.roman}
        </span>
      </div>
      <p className="font-display text-xl mt-2 tracking-widest" style={{ color: info.color }}>
        {info.title.toUpperCase()}
      </p>
    </div>
  );
}

export default function HeroStats({ user }) {
  const level = user?.current_level || 0;
  const streak = user?.current_streak || 0;
  const packs = user?.total_packs || 0;

  return (
    <div className="bg-surface border border-border p-6 md:p-10" style={{ borderRadius: '6px' }}>
      <div className="flex flex-col md:flex-row items-center justify-around gap-8">
        <LevelBadge level={level} />

        <div className="flex flex-col items-center">
          <span
            className="font-display"
            style={{ fontSize: 96, lineHeight: 1, color: '#E8332A' }}
          >
            {packs}
          </span>
          <p className="text-text-muted text-xs uppercase tracking-widest mt-1">Packs Logged</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          {streak > 0 ? (
            <div
              className="pulse-glow px-6 py-3 border border-red-arena bg-red-arena/10 text-center"
              style={{ borderRadius: '6px' }}
            >
              <p className="font-display text-4xl text-red-arena">🔥 DAY {streak}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest">Streak</p>
            </div>
          ) : (
            <div
              className="px-6 py-3 border border-border bg-surface-2 text-center"
              style={{ borderRadius: '6px' }}
            >
              <p className="font-display text-4xl text-text-muted">NO STREAK</p>
              <p className="text-text-muted text-xs uppercase tracking-widest">Redeem to start</p>
            </div>
          )}
          <p className="text-text-muted text-xs">
            Longest: {user?.longest_streak || 0} days
          </p>
        </div>
      </div>
    </div>
  );
}
