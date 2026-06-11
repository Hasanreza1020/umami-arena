import { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_W = 420;
const CANVAS_H = 340;
const BOWL_W = 80;
const BOWL_SPEED = 5;
const GAME_DURATION = 60;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function drawSpeedLines(ctx, lines, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  lines.forEach((l) => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x, l.y + l.len);
    ctx.stroke();
  });
  ctx.restore();
}

function drawBowl(ctx, x, y) {
  // Bowl body
  ctx.save();
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(x + BOWL_W / 2, y + 8, BOWL_W / 2, 20, 0, 0, Math.PI);
  ctx.fill();
  // Bowl rim
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(x + BOWL_W / 2, y, BOWL_W / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Shine
  ctx.fillStyle = 'rgba(255,200,150,0.2)';
  ctx.beginPath();
  ctx.ellipse(x + BOWL_W / 2 - 10, y - 2, 15, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNoodle(ctx, item) {
  ctx.save();
  ctx.strokeStyle = '#F5E06A';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 28; i++) {
    const nx = item.x + i;
    const ny = item.y + Math.sin((i + item.wave) * 0.5) * 5;
    if (i === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  ctx.stroke();
  // Second strand
  ctx.strokeStyle = '#E8D055';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const nx = item.x + 3 + i;
    const ny = item.y + 6 + Math.sin((i + item.wave + 1.5) * 0.5) * 4;
    if (i === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  ctx.stroke();
  ctx.restore();
}

function drawChili(ctx, item) {
  ctx.save();
  // Body
  ctx.fillStyle = '#E8332A';
  ctx.beginPath();
  ctx.ellipse(item.x, item.y, 7, 14, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Tip
  ctx.fillStyle = '#FF6B5A';
  ctx.beginPath();
  ctx.ellipse(item.x + 2, item.y + 10, 3, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Stem
  ctx.strokeStyle = '#4A8000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(item.x, item.y - 14);
  ctx.quadraticCurveTo(item.x + 6, item.y - 20, item.x + 4, item.y - 26);
  ctx.stroke();
  ctx.restore();
}

function drawEgg(ctx, item) {
  ctx.save();
  // Glow
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(item.x, item.y, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Shine
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(item.x - 3, item.y - 4, 4, 6, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function getScoreMessage(score) {
  if (score >= 400) return 'The Arena bows to you.';
  if (score >= 250) return 'Oni-level reflexes.';
  if (score >= 100) return 'Respectable work, Samurai.';
  return 'Not bad, Genin. Train harder.';
}

export default function NoodleCatch() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  // React-managed state for UI switching
  const [phase, setPhase] = useState('idle'); // idle | playing | over
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [displayTime, setDisplayTime] = useState(GAME_DURATION);
  const [finalScore, setFinalScore] = useState(0);

  // DOM refs for real-time display without re-renders (not needed since we use setState with rAF)

  const initState = useCallback((canvasW) => ({
    score: 0,
    lives: 3,
    timeLeft: GAME_DURATION,
    bowl: { x: canvasW / 2 - BOWL_W / 2 },
    items: [],
    keys: { left: false, right: false },
    lastSpawn: 0,
    spawnInterval: 900,
    speedLines: Array.from({ length: 12 }, () => ({
      x: Math.random() * canvasW,
      y: Math.random() * CANVAS_H,
      len: 20 + Math.random() * 40,
      speed: 3 + Math.random() * 3,
    })),
    canvasW,
    waveOffset: 0,
  }), []);

  function getCanvasWidth() {
    return window.innerWidth < 480 ? 300 : CANVAS_W;
  }

  const stopGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);
  }, []);

  const endGame = useCallback((score) => {
    stopGame();
    setFinalScore(score);
    setPhase('over');
  }, [stopGame]);

  const gameLoop = useCallback((timestamp) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');
    const W = s.canvasW;

    // Update speed lines
    s.speedLines.forEach((l) => {
      l.y += l.speed;
      if (l.y > CANVAS_H) { l.y = -l.len; l.x = Math.random() * W; }
    });

    // Move bowl
    if (s.keys.left) s.bowl.x = Math.max(0, s.bowl.x - BOWL_SPEED);
    if (s.keys.right) s.bowl.x = Math.min(W - BOWL_W, s.bowl.x + BOWL_SPEED);

    // Spawn items
    if (timestamp - s.lastSpawn > s.spawnInterval) {
      s.lastSpawn = timestamp;
      const r = Math.random();
      if (r < 0.12) {
        s.items.push({ type: 'egg', x: randomBetween(15, W - 15), y: -20, speed: randomBetween(1.8, 2.8) });
      } else if (r < 0.28) {
        s.items.push({ type: 'chili', x: randomBetween(15, W - 15), y: -20, speed: randomBetween(3, 5) });
      } else {
        s.items.push({ type: 'noodle', x: randomBetween(5, W - 35), y: -20, speed: randomBetween(2, 4), wave: Math.random() * 10 });
      }
      // Gradually speed up
      s.spawnInterval = Math.max(500, s.spawnInterval - 2);
    }

    s.waveOffset += 0.15;

    // Update items + collision
    const bowlTop = CANVAS_H - 34;
    const bowlLeft = s.bowl.x;
    const bowlRight = s.bowl.x + BOWL_W;

    s.items = s.items.filter((item) => {
      item.y += item.speed;
      if (item.wave !== undefined) item.wave = s.waveOffset;

      // Check collision
      const itemMidX = item.x + (item.type === 'noodle' ? 14 : 0);
      const itemBottom = item.y + (item.type === 'noodle' ? 12 : 14);

      if (itemBottom >= bowlTop && itemBottom <= bowlTop + 20 &&
          itemMidX >= bowlLeft && itemMidX <= bowlRight) {
        if (item.type === 'noodle') { s.score += 10; }
        else if (item.type === 'egg') { s.score += 30; }
        else if (item.type === 'chili') {
          s.lives -= 1;
          if (s.lives <= 0) {
            rafRef.current = null;
            setTimeout(() => endGame(s.score), 50);
            return false;
          }
        }
        setDisplayScore(s.score);
        setDisplayLives(s.lives);
        return false;
      }

      return item.y < CANVAS_H + 30;
    });

    // Draw
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, W, CANVAS_H);

    drawSpeedLines(ctx, s.speedLines, W, CANVAS_H);

    s.items.forEach((item) => {
      if (item.type === 'noodle') drawNoodle(ctx, item);
      else if (item.type === 'chili') drawChili(ctx, item);
      else drawEgg(ctx, item);
    });

    drawBowl(ctx, s.bowl.x, bowlTop);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [endGame]);

  const startGame = useCallback(() => {
    const W = getCanvasWidth();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = W;
      canvas.height = CANVAS_H;
    }

    stateRef.current = initState(W);
    setPhase('playing');
    setDisplayScore(0);
    setDisplayLives(3);
    setDisplayTime(GAME_DURATION);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!stateRef.current) return;
      stateRef.current.timeLeft -= 1;
      setDisplayTime(stateRef.current.timeLeft);
      if (stateRef.current.timeLeft <= 0) {
        clearInterval(timerRef.current);
        cancelAnimationFrame(rafRef.current);
        endGame(stateRef.current.score);
      }
    }, 1000);

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [initState, gameLoop, endGame]);

  // Keyboard controls
  useEffect(() => {
    function onKeyDown(e) {
      if (!stateRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
    }
    function onKeyUp(e) {
      if (!stateRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      stopGame();
    };
  }, [stopGame]);

  function holdLeft(holding) {
    if (stateRef.current) stateRef.current.keys.left = holding;
  }
  function holdRight(holding) {
    if (stateRef.current) stateRef.current.keys.right = holding;
  }

  const canvasW = typeof window !== 'undefined' && window.innerWidth < 480 ? 300 : CANVAS_W;

  return (
    <div className="bg-surface border border-border p-6" style={{ borderRadius: '6px' }}>
      <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Mini Game</p>
      <h2 className="font-display text-2xl text-text-primary tracking-wide mb-4">NOODLE CATCH</h2>

      {/* HUD */}
      {phase === 'playing' && (
        <div className="flex justify-between items-center mb-3 px-1">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest">Score</p>
            <p className="font-display text-2xl text-amber">{displayScore}</p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-xs uppercase tracking-widest">Lives</p>
            <p className="text-xl">{'🍜'.repeat(Math.max(0, displayLives))}</p>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-xs uppercase tracking-widest">Time</p>
            <p
              className="font-display text-2xl"
              style={{ color: displayTime <= 10 ? '#E8332A' : '#F0EDE6' }}
            >
              {displayTime}s
            </p>
          </div>
        </div>
      )}

      {/* Canvas */}
      {phase !== 'over' && (
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={canvasW}
            height={CANVAS_H}
            style={{ display: 'block', borderRadius: '4px', border: '1px solid #2A2A2A' }}
          />
        </div>
      )}

      {/* Game Over */}
      {phase === 'over' && (
        <div
          className="flex flex-col items-center justify-center py-10 bg-bg border border-border"
          style={{ borderRadius: '6px', minHeight: CANVAS_H }}
        >
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Game Over</p>
          <p className="font-display text-7xl text-red-arena mb-2">{finalScore}</p>
          <p className="text-text-primary text-lg mb-6 text-center px-4">{getScoreMessage(finalScore)}</p>
          <button
            onClick={startGame}
            className="bg-red-arena text-white font-display text-xl px-10 py-3 tracking-widest hover:bg-red-600 transition-colors"
            style={{ borderRadius: '6px' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Start Button */}
      {phase === 'idle' && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startGame}
            className="bg-red-arena text-white font-display text-xl px-10 py-3 tracking-widest hover:bg-red-600 transition-colors"
            style={{ borderRadius: '6px' }}
          >
            START GAME
          </button>
        </div>
      )}

      {/* Mobile Controls */}
      {phase === 'playing' && (
        <div className="flex justify-center gap-8 mt-4 sm:hidden">
          <button
            onPointerDown={() => holdLeft(true)}
            onPointerUp={() => holdLeft(false)}
            onPointerLeave={() => holdLeft(false)}
            className="bg-surface-2 border border-border text-text-primary font-display text-2xl px-8 py-4 select-none active:bg-red-arena/20 transition-colors"
            style={{ borderRadius: '6px', userSelect: 'none' }}
          >
            ◀
          </button>
          <button
            onPointerDown={() => holdRight(true)}
            onPointerUp={() => holdRight(false)}
            onPointerLeave={() => holdRight(false)}
            className="bg-surface-2 border border-border text-text-primary font-display text-2xl px-8 py-4 select-none active:bg-red-arena/20 transition-colors"
            style={{ borderRadius: '6px', userSelect: 'none' }}
          >
            ▶
          </button>
        </div>
      )}

      {phase === 'idle' && (
        <p className="text-text-muted text-xs text-center mt-3">
          Arrow keys / A-D to move • Catch noodles, dodge chilies!
        </p>
      )}
    </div>
  );
}
