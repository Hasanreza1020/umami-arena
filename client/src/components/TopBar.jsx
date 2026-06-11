const LEVEL_TITLES = ['Unranked', 'Genin', 'Ramen Apprentice', 'Broth Samurai', 'Umami Oni', 'The Ramen God'];

export default function TopBar({ user, onLogout }) {
  const title = LEVEL_TITLES[user?.current_level || 0];

  return (
    <header className="sticky top-0 z-40 bg-bg/95 border-b border-border backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-red-arena tracking-wider shrink-0">
          UMAMI ARENA
        </h1>

        <p className="text-text-muted text-xs tracking-widest uppercase hidden sm:block">
          Enter. Eat. Ascend.
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-text-primary text-sm font-semibold">{user?.name}</p>
            <p className="text-text-muted text-xs">{title}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-text-muted text-xs uppercase tracking-widest px-3 py-2 border border-border hover:border-red-arena hover:text-red-arena transition-colors"
            style={{ borderRadius: '6px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
