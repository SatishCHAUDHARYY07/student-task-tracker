import React from 'react';
import { Plus, Sparkles, Clock, RotateCcw, Download, Upload } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenPomodoro: () => void;
  isPomodoroOpen: boolean;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenPomodoro,
  isPomodoroOpen,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="relative border-b border-cyber-border bg-[#0B0914]/90 backdrop-blur-md sticky top-0 z-30">

      {/* Hero Showcase directly modeled from prototype */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Title and Subtitle with giant 01 */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl sm:text-7xl font-extrabold text-[#E5FE40] leading-none tracking-tight select-none glow-text-yellow">
                01
              </span>
              <div className="border-l-2 border-[#E5FE40]/30 pl-4">
                <span className="text-[11px] font-mono tracking-widest text-[#00F0FF] uppercase block">
                  Official Specification
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[0.95]">
                  Student Task &<br />Deadline Tracker
                </h1>
              </div>
            </div>

            <p className="text-cyber-muted text-sm sm:text-base max-w-xl font-normal leading-relaxed pt-1">
              Create an app that helps students organize assignments, projects and upcoming deadlines in one place.
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCreateModal}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#E5FE40] text-black shadow-neon-yellow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#efff5c]"
              >
                <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                <span>Add New Task</span>
              </button>

              <button
                onClick={onOpenPomodoro}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                  isPomodoroOpen
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF] shadow-neon-cyan'
                    : 'bg-[#181432] text-white/90 border-white/10 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isPomodoroOpen ? 'Hide Focus Timer' : 'Focus Mode (Pomodoro)'}</span>
              </button>

              {/* Utility Dropdown / Buttons */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-[#131024] p-1 rounded-xl border border-white/[0.08]">
                <button
                  onClick={onExportData}
                  title="Export tasks to JSON backup"
                  className="p-2 text-cyber-muted hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Import tasks from JSON"
                  className="p-2 text-cyber-muted hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onImportData}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={onResetData}
                  title="Reset to prototype demo tasks"
                  className="p-2 text-cyber-muted hover:text-[#E5FE40] rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right prototype spec box directly recreating the slide's card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#14102A]/80 border border-cyber-border hover:border-cyber-cyan/30 transition-all duration-300 p-5 sm:p-6 backdrop-blur-xl shadow-cyber-card glow-box-cyan">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                  <span className="font-mono text-xs font-bold tracking-widest text-[#00F0FF] uppercase">
                    MUST-HAVE FEATURES
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> ACTIVE SYSTEM
                </span>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-200 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00F0FF] font-mono text-base leading-none mt-0.5">•</span>
                  <span><strong className="text-white">Add, edit and delete tasks</strong> with intuitive modal & quick actions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00F0FF] font-mono text-base leading-none mt-0.5">•</span>
                  <span><strong className="text-white">Set due dates and priority</strong> with live countdown & urgency badges</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00F0FF] font-mono text-base leading-none mt-0.5">•</span>
                  <span><strong className="text-white">Track pending and completed tasks</strong> in List, Kanban, and Calendar views</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
