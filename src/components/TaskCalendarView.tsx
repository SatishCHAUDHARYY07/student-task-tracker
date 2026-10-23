import React, { useState } from 'react';
import { Task } from '../types/task';
import { getPriorityBadge } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Clock } from 'lucide-react';

interface TaskCalendarViewProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate 7 days for the selected week
  const today = new Date();
  const currentStartOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 is Sunday
  currentStartOfWeek.setDate(today.getDate() - dayOfWeek + weekOffset * 7);
  currentStartOfWeek.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentStartOfWeek);
    d.setDate(currentStartOfWeek.getDate() + i);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (d: Date) => isSameDay(d, today);

  return (
    <div className="bg-[#120F26] border border-white/[0.08] rounded-2xl p-5">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#A855F7]" />
          <h3 className="font-display text-xl text-white font-bold tracking-wider uppercase">
            Upcoming Deadlines Schedule
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyber-muted hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1 text-xs font-mono rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyber-muted hover:text-white transition-colors"
          >
            Current Week
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyber-muted hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Days Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), day));
          const isCurrentDay = isToday(day);

          return (
            <div
              key={idx}
              className={`flex flex-col rounded-xl border p-3 min-h-[260px] transition-all ${
                isCurrentDay
                  ? 'bg-[#1C163C] border-[#E5FE40]/50 shadow-[0_0_15px_-4px_rgba(229,254,64,0.3)]'
                  : 'bg-[#15112E]/70 border-white/[0.05]'
              }`}
            >
              {/* Day title */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.05]">
                <div>
                  <span className="text-[11px] font-mono text-cyber-muted uppercase block">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={`text-base font-bold ${isCurrentDay ? 'text-[#E5FE40]' : 'text-white'}`}>
                    {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {isCurrentDay && (
                  <span className="text-[9px] font-mono font-bold bg-[#E5FE40] text-black px-1.5 py-0.5 rounded">
                    TODAY
                  </span>
                )}
              </div>

              {/* Tasks for that day */}
              <div className="space-y-2 flex-1">
                {dayTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] font-mono text-cyber-muted/40">
                    No deadlines
                  </div>
                ) : (
                  dayTasks.map((t) => {
                    const isCompleted = t.status === 'completed';
                    const priority = getPriorityBadge(t.priority);

                    return (
                      <div
                        key={t.id}
                        onClick={() => onEditTask(t)}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                          isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/20 opacity-70'
                            : 'bg-[#1D183D] border-white/[0.08] hover:border-[#00F0FF]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-mono font-bold text-[#00F0FF]">
                            {t.course}
                          </span>
                          <span className={`text-[8px] font-mono px-1 rounded ${priority.className}`}>
                            {t.priority}
                          </span>
                        </div>

                        <div className={`text-xs font-medium line-clamp-2 ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {t.title}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-cyber-muted font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(t.dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(t);
                            }}
                            className={`p-0.5 rounded ${
                              isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
