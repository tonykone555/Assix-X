import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, AlertCircle, Delete } from 'lucide-react';

interface PinLoginGateProps {
  onUnlock: () => void;
  isLight?: boolean;
}

export const PinLoginGate: React.FC<PinLoginGateProps> = ({ onUnlock, isLight = false }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [storedPin] = useState<string>(() => {
    return localStorage.getItem('assix_pin_code') || '2010';
  });

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === storedPin) {
          sessionStorage.setItem('assix_authenticated', 'true');
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, storedPin]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 ${
      isLight 
        ? 'bg-slate-950/95 backdrop-blur-2xl text-slate-100' 
        : 'bg-[#09090C]/98 backdrop-blur-2xl text-white'
    }`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C5335]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xs mx-auto flex flex-col items-center relative z-10">
        
        {/* ASSIX LOGO & HEADING */}
        <div className="flex flex-col items-center mb-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8C5D3C] via-[#633F27] to-[#3B2214] flex items-center justify-center shadow-xl shadow-[#7C5335]/30 border border-amber-500/20 ring-1 ring-amber-500/10">
            <Lock className="text-amber-200 w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-[0.25em] text-white uppercase flex items-center justify-center gap-1">
              ASSIX<span className="text-[#C98A5B]">.</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
              Protected Workspace
            </p>
          </div>
        </div>

        {/* PIN DIGITS DISPLAY */}
        <div className={`mb-6 flex items-center justify-center gap-3.5 p-3.5 rounded-2xl border w-full transition-all ${
          error 
            ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-shake' 
            : 'bg-[#121218] border-zinc-800/80 text-white shadow-inner'
        }`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-10 h-11 rounded-xl flex items-center justify-center text-lg font-mono font-bold transition-all transform ${
                  isFilled
                    ? 'bg-[#7C5335] text-white scale-105 shadow-md shadow-[#7C5335]/50 border border-amber-400/40'
                    : 'bg-[#181822] border border-zinc-800/80 text-zinc-600'
                }`}
              >
                {isFilled ? '•' : ''}
              </div>
            );
          })}
        </div>

        {/* ERROR MSG */}
        {error ? (
          <div className="mb-4 text-[11px] font-semibold text-red-400 flex items-center gap-1.5 animate-bounce">
            <AlertCircle size={13} />
            <span>Incorrect PIN code. Please try again.</span>
          </div>
        ) : (
          <div className="mb-4 text-[11px] text-zinc-500 font-medium flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Enter 4-digit security code</span>
          </div>
        )}

        {/* KEYPAD GRID */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-13 rounded-2xl bg-[#14141C] hover:bg-[#1C1C28] active:scale-95 border border-zinc-800/80 text-white font-mono font-bold text-lg transition-all flex items-center justify-center cursor-pointer shadow-sm hover:border-zinc-700"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-13 rounded-2xl bg-[#14141C] hover:bg-zinc-800 active:scale-95 border border-zinc-800/80 text-zinc-400 font-bold text-[11px] transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider hover:border-zinc-700"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-13 rounded-2xl bg-[#14141C] hover:bg-[#1C1C28] active:scale-95 border border-zinc-800/80 text-white font-mono font-bold text-lg transition-all flex items-center justify-center cursor-pointer shadow-sm hover:border-zinc-700"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-13 rounded-2xl bg-[#14141C] hover:bg-zinc-800 active:scale-95 border border-zinc-800/80 text-zinc-400 transition-all flex items-center justify-center cursor-pointer hover:border-zinc-700"
          >
            <Delete size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

