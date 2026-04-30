/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'radial-gradient(circle at center, #0a0f1d 0%, #05050A 100%)' }}>
      {/* Decorative Grid Lines Overlay Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}></div>
      
      {/* App Header */}
      <header className="relative z-10 w-full py-6 text-center border-b border-cyan-500/20 bg-[#0a0f1d]/50 backdrop-blur-sm">
        <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-cyan-400 text-glow-cyan drop-shadow-lg font-mono">
          Neon<span className="text-white mx-2">||</span>Beats
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col xl:flex-row items-center justify-center p-4 xl:p-12 gap-8 xl:gap-24">
        {/* Left Side / Bottom on Mobile - Music Player */}
        <div className="w-full xl:w-96 flex flex-col order-2 xl:order-1 items-center justify-center">
          <MusicPlayer />
          
          {/* Aesthetic text */}
          <div className="mt-8 text-center hidden xl:block">
            <h3 className="text-zinc-600 font-mono text-xs uppercase tracking-[0.3em] mb-2 font-bold">System Online</h3>
            <div className="w-full flex justify-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-1 bg-cyan-700/50 rounded-sm" />
              ))}
            </div>
            <p className="text-zinc-500/50 text-[10px] mt-2 max-w-[200px] mx-auto leading-relaxed">
              INITIALIZE AUDIO SUBSYSTEM<br/>
              AWAITING USER INPUT
            </p>
          </div>
        </div>

        {/* Center / Top on Mobile - Snake Game */}
        <div className="w-full max-w-[500px] order-1 xl:order-2 flex-grow flex items-center justify-center">
          <SnakeGame />
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 w-full border-t border-fuchsia-500/20 bg-fuchsia-950/10 h-10 flex items-center justify-between px-6 text-[10px] text-fuchsia-400/50 font-mono tracking-widest">
        <span>V.1.0</span>
        <span className="hidden sm:inline-block">CYBERNETIC_ENTERTAINMENT_SYS</span>
        <span>A.I. CONNECTED</span>
      </footer>
    </div>
  );
}
