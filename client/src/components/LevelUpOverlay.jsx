import { useEffect, useRef } from 'react';

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const dist = 80 + Math.random() * 120;
    const rad = (angle * Math.PI) / 180;
    return {
      tx: `${Math.cos(rad) * dist}px`,
      ty: `${Math.sin(rad) * dist}px`,
      color: Math.random() > 0.5 ? '#E8332A' : '#F5A623',
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.4,
    };
  });
}

const particles = generateParticles(30);

export default function LevelUpOverlay({ level, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center level-up-overlay"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onDismiss}
    >
      {/* Particles */}
      <div className="absolute" style={{ pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute particle"
            style={{
              '--tx': p.tx,
              '--ty': p.ty,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDelay: `${p.delay}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <p
          className="font-display tracking-widest text-text-muted mb-2"
          style={{ fontSize: 18, letterSpacing: '0.4em' }}
        >
          RANK UP
        </p>

        <div
          className="rank-title-enter"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(48px, 12vw, 96px)',
            color: '#E8332A',
            letterSpacing: '0.08em',
            textShadow: '0 0 40px rgba(232,51,42,0.8)',
            lineHeight: 1,
          }}
        >
          {level.title.toUpperCase()}
        </div>

        <div
          className="mt-4 inline-block border border-red-arena/40 px-6 py-2"
          style={{ borderRadius: '4px', background: 'rgba(232,51,42,0.1)' }}
        >
          <p className="text-text-muted text-sm">Level {level.level} Achieved</p>
        </div>

        <p className="text-text-muted text-xs mt-8 tracking-widest">Tap to continue</p>
      </div>
    </div>
  );
}
