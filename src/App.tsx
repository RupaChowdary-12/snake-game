import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#00FFFF] flex flex-col items-center justify-center p-4 relative font-mono">
      <div className="scanlines"></div>
      <div className="noise-bg"></div>
      <div className="crt-flicker absolute inset-0 pointer-events-none"></div>
      
      <header className="w-full max-w-5xl flex justify-between items-end mb-8 z-10 border-b-4 border-[#FF00FF] pb-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold glitch-text" data-text="NEURAL_LINK">
            NEURAL_LINK
          </h1>
          <p className="text-[#FF00FF] neon-text-magenta text-xl tracking-[0.2em] mt-2">
            &gt;&gt; PROTOCOL: OROBOROS_V2.1
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <p className="text-lg text-[#00FFFF] tracking-widest mb-1 animate-pulse">DATA_HARVESTED</p>
          <p className="text-6xl font-bold neon-text text-[#FFFF00]">
            {score.toString().padStart(6, '0')}
          </p>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-center z-10">
        <div className="flex-1 w-full flex justify-center">
          <SnakeGame onScoreUpdate={setScore} />
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="neon-box-magenta p-6">
            <h3 className="text-[#FF00FF] neon-text-magenta tracking-widest text-2xl mb-4 border-b-2 border-[#FF00FF] pb-2">&gt;&gt; SYS_CONTROLS</h3>
            <ul className="text-lg text-[#00FFFF] space-y-3">
              <li className="flex justify-between"><span>VECTOR_INPUT:</span> <span className="text-[#FFFF00]">W A S D</span></li>
              <li className="flex justify-between"><span>TARGET:</span> <span className="text-[#FF00FF]">ASSIMILATE_DATA</span></li>
              <li className="flex justify-between"><span>AVOID:</span> <span className="text-red-500">BOUNDARY_COLLISION</span></li>
            </ul>
          </div>
          
          <MusicPlayer />
        </div>
      </main>

      <footer className="mt-12 text-lg text-[#00FFFF] tracking-widest z-10 border-t-2 border-[#00FFFF] pt-4 w-full max-w-5xl text-center">
        CONNECTION_SECURE // ENCRYPTION_LEVEL: OMEGA // AWAITING_INPUT...
      </footer>
    </div>
  );
}
