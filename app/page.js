'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const HEART_BURST_COUNT = 56;
const ARENA_HEIGHT = 130;
const EDGE_PADDING = 12;
const PROXIMITY_RADIUS = 120;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function HomePage() {
  const [accepted, setAccepted] = useState(false);
  const [burstSeed, setBurstSeed] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const arenaRef = useRef(null);
  const noRef = useRef(null);

  const hearts = useMemo(
    () =>
      Array.from({ length: HEART_BURST_COUNT }, (_, index) => ({
        id: `${burstSeed}-${index}`,
        left: randomInRange(4, 96),
        delay: randomInRange(0, 0.9),
        duration: randomInRange(1.8, 3.8),
        drift: randomInRange(-32, 32),
        size: randomInRange(18, 42)
      })),
    [burstSeed]
  );

  useEffect(() => {
    const resetNoButton = () => {
      const arena = arenaRef.current;
      const noButton = noRef.current;

      if (!arena || !noButton) {
        return;
      }

      const arenaRect = arena.getBoundingClientRect();
      const noRect = noButton.getBoundingClientRect();
      const initialX = arenaRect.width - noRect.width - EDGE_PADDING;
      const initialY = (ARENA_HEIGHT - noRect.height) / 2;

      setNoPosition({
        x: clamp(initialX, EDGE_PADDING, Math.max(EDGE_PADDING, arenaRect.width - noRect.width - EDGE_PADDING)),
        y: clamp(initialY, EDGE_PADDING, Math.max(EDGE_PADDING, ARENA_HEIGHT - noRect.height - EDGE_PADDING))
      });
    };

    resetNoButton();
    window.addEventListener('resize', resetNoButton);

    return () => window.removeEventListener('resize', resetNoButton);
  }, []);

  const dodgeFromPointer = (clientX, clientY) => {
    const arena = arenaRef.current;
    const noButton = noRef.current;

    if (!arena || !noButton || accepted) {
      return;
    }

    const arenaRect = arena.getBoundingClientRect();
    const noRect = noButton.getBoundingClientRect();

    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    const dx = noCenterX - clientX;
    const dy = noCenterY - clientY;
    const distance = Math.hypot(dx, dy);

    if (distance > PROXIMITY_RADIUS) {
      return;
    }

    const magnitude = randomInRange(60, 110);
    const directionX = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : dx / (distance || 1);
    const directionY = dy === 0 ? (Math.random() > 0.5 ? 1 : -1) : dy / (distance || 1);

    const currentX = noRect.left - arenaRect.left;
    const currentY = noRect.top - arenaRect.top;

    const maxX = arenaRect.width - noRect.width - EDGE_PADDING;
    const maxY = ARENA_HEIGHT - noRect.height - EDGE_PADDING;

    setNoPosition({
      x: clamp(currentX + directionX * magnitude + randomInRange(-18, 18), EDGE_PADDING, Math.max(EDGE_PADDING, maxX)),
      y: clamp(currentY + directionY * magnitude + randomInRange(-16, 16), EDGE_PADDING, Math.max(EDGE_PADDING, maxY))
    });
  };

  const acceptValentine = () => {
    setAccepted(true);
    setBurstSeed((seed) => seed + 1);
  };

  return (
    <main className="page-shell">
      <div className={`card ${accepted ? 'accepted' : ''}`}>
        <p className="tiny">💞 Hey cutie pie 💞</p>
        <h1>Will you be my Valentine? 💘</h1>
        <p className="subtitle">I saved the sweetest table just for us 🕯️🌹✨</p>

        {!accepted ? (
          <div
            className="button-arena"
            ref={arenaRef}
            onPointerMove={(event) => dodgeFromPointer(event.clientX, event.clientY)}
          >
            <button className="btn yes" onClick={acceptValentine}>
              Yes 💖
            </button>
            <button
              ref={noRef}
              className="btn no"
              style={{ left: `${noPosition.x}px`, top: `${noPosition.y}px` }}
              onMouseEnter={(event) => dodgeFromPointer(event.clientX, event.clientY)}
              onPointerDown={(event) => dodgeFromPointer(event.clientX, event.clientY)}
              onTouchStart={() =>
                setNoPosition((current) => ({
                  ...current,
                  x: clamp(current.x + randomInRange(-95, 95), EDGE_PADDING, (arenaRef.current?.clientWidth || 250) - 92)
                }))
              }
              aria-label="No"
            >
              No 🙈
            </button>
          </div>
        ) : (
          <div className="success-wrap" role="status" aria-live="polite">
            <p className="success-message">Best decision ever. I love you Be ready for dinner on February 14.</p>
            <p className="tiny">💖🥰💕💌</p>
            <div className="heart-burst" aria-hidden="true">
              {hearts.map((heart) => (
                <span
                  key={heart.id}
                  className="heart"
                  style={{
                    left: `${heart.left}%`,
                    animationDelay: `${heart.delay}s`,
                    animationDuration: `${heart.duration}s`,
                    '--drift': `${heart.drift}px`,
                    fontSize: `${heart.size}px`
                  }}
                >
                  💖
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
