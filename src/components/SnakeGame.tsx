import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 100;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Sync score to parent via useEffect to avoid React state update errors
  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsStarted(true);
    gameAreaRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isStarted || gameOver) return;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
      e.preventDefault();
    }

    setDirection(prev => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return prev.y === 1 ? prev : { x: 0, y: -1 };
        case 'ArrowDown':
        case 's':
        case 'S':
          return prev.y === -1 ? prev : { x: 0, y: 1 };
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return prev.x === 1 ? prev : { x: -1, y: 0 };
        case 'ArrowRight':
        case 'd':
        case 'D':
          return prev.x === -1 ? prev : { x: 1, y: 0 };
        default:
          return prev;
      }
    });
  }, [isStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 15);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isStarted, gameOver, direction, food, generateFood]);

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full max-w-[500px] aspect-square neon-box bg-[#050505] mx-auto focus:outline-none"
      tabIndex={0}
    >
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      />

      {snake.map((segment, index) => {
        const isHead = index === 0;
        return (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${isHead ? 'bg-[#FFFF00] shadow-[0_0_15px_#FFFF00] z-10' : 'bg-[#00FFFF] shadow-[0_0_8px_#00FFFF]'} transition-all duration-75`}
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
            }}
          />
        );
      })}

      <div
        className="absolute bg-[#FF00FF] shadow-[0_0_15px_#FF00FF] animate-pulse"
        style={{
          left: `${(food.x / GRID_SIZE) * 100}%`,
          top: `${(food.y / GRID_SIZE) * 100}%`,
          width: `${100 / GRID_SIZE}%`,
          height: `${100 / GRID_SIZE}%`,
        }}
      />

      {!isStarted && !gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <h2 className="text-5xl font-bold text-[#00FFFF] mb-8 glitch-text" data-text="AWAITING_LINK">
            AWAITING_LINK
          </h2>
          <button 
            onClick={resetGame}
            className="px-8 py-3 text-2xl border-4 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors shadow-[0_0_15px_#FF00FF,inset_0_0_15px_#FF00FF]"
          >
            [ EXECUTE ]
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <h2 className="text-6xl font-bold text-red-500 mb-4 glitch-text" data-text="FATAL_ERROR" style={{ textShadow: '0 0 20px red' }}>
            FATAL_ERROR
          </h2>
          <p className="text-[#FFFF00] text-3xl mb-8 animate-pulse">DATA_CORRUPTED // SCORE: {score}</p>
          <button 
            onClick={resetGame}
            className="px-8 py-3 text-2xl border-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors shadow-[0_0_15px_#00FFFF,inset_0_0_15px_#00FFFF]"
          >
            [ REBOOT ]
          </button>
        </div>
      )}
    </div>
  );
}
