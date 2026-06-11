const RANKS = [
  { level: 1, title: 'Genin', packs: 1 },
  { level: 2, title: 'Ramen Apprentice', packs: 4 },
  { level: 3, title: 'Broth Samurai', packs: 11 },
  { level: 4, title: 'Umami Oni', packs: 26 },
  { level: 5, title: 'The Ramen God', packs: 46 },
];

export default function RankBar({ totalPacks, currentLevel }) {
  const nextRank = RANKS.find((r) => r.level > currentLevel);
  const packsToNext = nextRank ? nextRank.packs - totalPacks : 0;

  return (
    <div className="bg-surface border border-border p-6" style={{ borderRadius: '6px' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Rank Progression</p>
          <h2 className="font-display text-2xl text-text-primary tracking-wide">ARENA RANKS</h2>
        </div>
        {nextRank && (
          <p className="text-text-muted text-sm text-right">
            <span className="text-amber font-semibold">{packsToNext}</span> packs to{' '}
            <span className="text-text-primary">{nextRank.title}</span>
          </p>
        )}
        {!nextRank && (
          <p className="text-red-arena font-display text-xl">MAX RANK</p>
        )}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-border" />
          <div
            className="absolute top-5 left-0 h-px bg-red-arena transition-all duration-700"
            style={{
              width: currentLevel === 0 ? '0%' : `${Math.min(((currentLevel - 1) / 4) * 100, 100)}%`,
            }}
          />

          {RANKS.map((rank) => {
            const unlocked = currentLevel >= rank.level;
            const isCurrent = currentLevel === rank.level;

            return (
              <div key={rank.level} className="flex flex-col items-center relative z-10">
                <div
                  className="w-10 h-10 flex items-center justify-center font-display text-lg transition-all duration-300"
                  style={{
                    borderRadius: '50%',
                    background: isCurrent
                      ? '#E8332A'
                      : unlocked
                      ? '#2A0A0A'
                      : '#1A1A1A',
                    border: isCurrent
                      ? '2px solid #E8332A'
                      : unlocked
                      ? '2px solid #E8332A'
                      : '2px solid #2A2A2A',
                    boxShadow: isCurrent ? '0 0 16px rgba(232,51,42,0.6)' : 'none',
                    color: isCurrent ? 'white' : unlocked ? '#E8332A' : '#9A9A8A',
                  }}
                >
                  {rank.level}
                </div>
                <p
                  className="text-xs mt-2 text-center max-w-[60px] leading-tight hidden sm:block"
                  style={{ color: isCurrent ? '#E8332A' : unlocked ? '#F0EDE6' : '#9A9A8A' }}
                >
                  {rank.title}
                </p>
                <p className="text-xs mt-1 hidden sm:block" style={{ color: '#9A9A8A' }}>
                  {rank.packs}p
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
