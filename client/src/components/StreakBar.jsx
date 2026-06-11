export default function StreakBar({ recentDays, streak }) {
  const days = ['Today', 'Yesterday', '2d ago', '3d ago', '4d ago', '5d ago', '6d ago'];

  return (
    <div className="bg-surface border border-border px-6 py-4" style={{ borderRadius: '6px' }}>
      <p className="text-text-muted text-xs uppercase tracking-widest mb-3">7-Day Activity</p>
      <div className="flex gap-2 items-end">
        {days.map((label, i) => {
          const filled = recentDays[i];
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full transition-all"
                style={{
                  height: 32,
                  borderRadius: '4px',
                  background: filled ? '#E8332A' : '#2A2A2A',
                  boxShadow: filled ? '0 0 8px rgba(232,51,42,0.4)' : 'none',
                  border: `1px solid ${filled ? '#E8332A' : '#333'}`,
                }}
              />
              <p className="text-text-muted text-xs hidden sm:block truncate w-full text-center">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
