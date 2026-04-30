import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dir, setDir] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Queue to prevent double keypresses causing instant death (turning back on itself)
  const directionQueue = useRef<{ x: number; y: number }[]>([]);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    directionQueue.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      // Get the last requested direction, or the current direction
      const lastDir =
        directionQueue.current.length > 0
          ? directionQueue.current[directionQueue.current.length - 1]
          : dir;

      let nextDir = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y === 0) nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y === 0) nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x === 0) nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x === 0) nextDir = { x: 1, y: 0 };
          break;
        default:
          break;
      }

      if (nextDir) {
        directionQueue.current.push(nextDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Base speed 150ms, getting faster as score increases, max speed 60ms
    const speed = Math.max(60, 150 - score * 2);

    const moveTimer = setTimeout(() => {
      setSnake((prevSnake) => {
        let currentDir = dir;
        if (directionQueue.current.length > 0) {
           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
           currentDir = directionQueue.current.shift()!;
           setDir(currentDir);
        }

        const head = {
          x: prevSnake[0].x + currentDir.x,
          y: prevSnake[0].y + currentDir.y,
        };

        // Check walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    }, speed);

    return () => clearTimeout(moveTimer);
  }, [snake, dir, isPlaying, isGameOver, food, generateFood, score, highScore]);


  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      {/* Score Header */}
      <div className="w-full flex justify-between items-center mb-6 px-4 py-3 bg-[#0a0f1d]/80 border border-cyan-500/30 rounded-xl backdrop-blur-md box-glow-cyan shadow-cyan-500/20">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-400/70 uppercase tracking-widest font-mono">Score</span>
          <span className="text-3xl font-bold text-cyan-400 text-glow-cyan font-mono leading-none">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 opacity-80">
            <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-xs text-fuchsia-400 uppercase tracking-widest font-mono">Best</span>
          </div>
          <span className="text-xl font-bold text-fuchsia-400 text-glow-pink font-mono leading-none">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative shadow-2xl rounded-sm overflow-hidden border-2 border-[#1f2937] bg-[#05050A]"
        style={{ width: '100%', aspectRatio: '1/1', maxWidth: '500px' }}
      >
        {/* Grid Background overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {isPlaying ? (
          <>
            {/* Food */}
            <div
              className="absolute bg-fuchsia-500 box-glow-pink rounded-full w-4 h-4"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                transform: 'scale(0.8)',
              }}
            />

            {/* Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute rounded-sm ${
                    isHead 
                      ? 'bg-lime-400 box-glow-green z-10' 
                      : 'bg-lime-500/80 opacity-80 border-t border-b border-lime-700/50'
                  }`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    transform: isHead ? 'scale(1.05)' : 'scale(0.95)',
                  }}
                />
              );
            })}
          </>
        ) : null}

        {/* Start / Game Over Overlay */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#05050A]/80 backdrop-blur-sm p-6 text-center">
             {isGameOver ? (
               <>
                 <h2 className="text-4xl md:text-5xl font-black text-fuchsia-500 mb-2 text-glow-pink uppercase tracking-wider">System Failure</h2>
                 <p className="text-zinc-400 mb-8 font-mono">Final Score: <span className="text-white">{score}</span></p>
                 <button 
                  onClick={resetGame}
                  className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-md border border-cyan-500 cursor-pointer transition-all hover:box-glow-cyan"
                 >
                   <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all" />
                   <div className="relative flex items-center justify-center gap-2 text-cyan-400 font-mono font-bold tracking-widest uppercase">
                     <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                     <span>Restart System</span>
                   </div>
                 </button>
               </>
             ) : (
               <>
                 <div className="w-16 h-16 rounded-full border-2 border-lime-500 box-glow-green flex items-center justify-center mb-6">
                   <div className="w-3 h-3 bg-lime-500 rounded-full animate-ping" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">Grid Initialized</h2>
                 <button 
                  onClick={resetGame}
                  className="group relative px-10 py-4 bg-lime-500 text-black overflow-hidden rounded-md cursor-pointer transition-all hover:bg-lime-400 hover:box-glow-green"
                 >
                   <div className="relative flex items-center justify-center gap-2 font-mono font-bold tracking-widest uppercase text-lg">
                     <Play className="w-5 h-5 fill-black" />
                     <span>Execute</span>
                   </div>
                 </button>
                 <p className="mt-8 gap-4 flex text-xs text-zinc-500 font-mono">
                   <span>[W][A][S][D] or ARROWS</span>
                 </p>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
