import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { Play, Pause, RotateCcw, X, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: Task | null;
  onClearActiveTask: () => void;
}

type Mode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<Mode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  activeTask,
  onClearActiveTask,
}) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } catch {
        // ignore
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(MODE_TIMES[mode]);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((MODE_TIMES[mode] - timeLeft) / MODE_TIMES[mode]) * 100;

  return (
    <div className="mb-6 bg-[#140F2D] border border-cyber-cyan/30 rounded-2xl p-5 shadow-cyber-card glow-box-cyan relative overflow-hidden animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <h3 className="font-display text-lg text-white font-bold tracking-wider uppercase">
            Study Focus Session
          </h3>
          {activeTask && (
            <span className="text-xs bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
              <Target className="w-3 h-3" /> Focus: {activeTask.course} - {activeTask.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeTask && (
            <button
              onClick={onClearActiveTask}
              className="text-xs text-cyber-muted hover:text-white px-2 py-1 rounded bg-white/[0.05]"
            >
              Clear Focus Task
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#0B0914] p-1.5 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => handleModeChange('focus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              mode === 'focus' ? 'bg-[#E5FE40] text-black font-bold shadow-neon-yellow' : 'text-cyber-muted hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              mode === 'shortBreak' ? 'bg-[#00F0FF] text-black font-bold shadow-neon-cyan' : 'text-cyber-muted hover:text-white'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              mode === 'longBreak' ? 'bg-[#A855F7] text-white font-bold' : 'text-cyber-muted hover:text-white'
            }`}
          >
            15m Long Break
          </button>
        </div>

        {/* Big Countdown Timer */}
        <div className="flex items-center gap-6">
          <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest flex items-center gap-1">
            <span className={isRunning ? 'text-[#E5FE40]' : 'text-white'}>
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-cyber-muted animate-pulse">:</span>
            <span className={isRunning ? 'text-[#00F0FF]' : 'text-white'}>
              {String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3 rounded-xl font-bold transition-all shadow-md ${
                isRunning
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-[#E5FE40] text-black hover:bg-[#efff5c] shadow-neon-yellow'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-white/[0.08] text-white hover:bg-white/[0.15] transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-white/[0.05] h-1.5 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00F0FF] via-[#E5FE40] to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
