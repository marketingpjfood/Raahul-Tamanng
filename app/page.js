'use client';

import { useMemo, useState } from 'react';

const HEART_BURST_COUNT = 48;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function HomePage() {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const hearts = useMemo(
    () =>
      Array.from({ length: HEART_BURST_COUNT }, (_, index) => ({
        id: index,
        left: randomInRange(10, 90),
        delay: randomInRange(0, 0.8),
        duration: randomInRange(1.8, 3.6),
        drift: randomInRange(-24, 24),
        size: randomInRange(18, 40)
      })),
    [accepted]
  );

  const moveNoButton = () => {
    const maxX = window.innerWidth * 0.38;
    const maxY = window.innerHeight * 0.36;
    setNoPosition({
      x: randomInRange(-maxX, maxX),
      y: randomInRange(-maxY, maxY)
    });
  };

  return (
    <main className="page-shell">
      <div className={`card ${accepted ? 'accepted' : ''}`}>
        <p className="tiny">💞 Hey cutie pie 💞</p>
        <h1>Will you be my Valentine? 💘</h1>
        <p className="subtitle">I saved the sweetest table just for us 🕯️🌹✨</p>

        {!accepted ? (
          <div className="button-row">
            <button className="btn yes" onClick={() => setAccepted(true)}>
              Yes 💖
            </button>
            <button
              className="btn no"
              style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
              onMouseEnter={moveNoButton}
              onMouseMove={moveNoButton}
              onPointerDown={moveNoButton}
              onClick={moveNoButton}
              aria-label="No"
            >
              No 🙈
            </button>
          </div>
        ) : (
          <div className="success-wrap" role="status" aria-live="polite">
            <p className="success-message">
              Best decision ever. I love you Be ready for dinner on February 14.
            </p>
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
