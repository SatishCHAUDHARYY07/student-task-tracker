import React from 'react';
import { Task } from '../types/task';
import { CheckCircle2, Clock, AlertTriangle, Layers, Flame } from 'lucide-react';

interface StatsOverviewProps {
  tasks: Task[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status !== 'completed').length;

  const now = new Date();
  const overdue = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    return new Date(t.dueDate).getTime() < now.getTime();
  }).length;

  const dueSoon = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const diffHours = (new Date(t.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 24;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 my-6">
      {/* Total Tasks */}
      <div className="bg-[#14102A]/90 border border-white/[0.07] rounded-2xl p-4 relative overflow-hidden group hover:border-[#E5FE40]/40 transition-all duration-300">
        <div className="flex items-center justify-between text-cyber-muted mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Total Tasks</span>
          <Layers className="w-4 h-4 text-[#E5FE40]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {total}
          </span>
          <span className="text-xs text-cyber-muted">assignments</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#E5FE40]/5 rounded-full blur-xl group-hover:bg-[#E5FE40]/10 transition-colors" />
      </div>

      {/* Pending / Active */}
      <div className="bg-[#14102A]/90 border border-white/[0.07] rounded-2xl p-4 relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
        <div className="flex items-center justify-between text-cyber-muted mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">In Flight</span>
          <Clock className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold text-amber-400 tracking-tight">
            {pending}
          </span>
          <span className="text-xs text-cyber-muted">pending</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-amber-400/5 rounded-full blur-xl group-hover:bg-amber-400/10 transition-colors" />
      </div>

      {/* Completed */}
      <div className="bg-[#14102A]/90 border border-white/[0.07] rounded-2xl p-4 relative overflow-hidden group hover:border-[#00F0FF]/40 transition-all duration-300">
        <div className="flex items-center justify-between text-cyber-muted mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Completed</span>
          <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold text-[#00F0FF] tracking-tight">
            {completed}
          </span>
          <span className="text-xs text-cyber-muted">{completionRate}% finished</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#E5FE40] rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Overdue Alert */}
      <div className={`bg-[#14102A]/90 border rounded-2xl p-4 relative overflow-hidden group transition-all duration-300 ${
        overdue > 0 ? 'border-rose-500/40 shadow-[0_0_15px_-3px_rgba(244,63,94,0.25)]' : 'border-white/[0.07]'
      }`}>
        <div className="flex items-center justify-between text-cyber-muted mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Overdue</span>
          <AlertTriangle className={`w-4 h-4 ${overdue > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${
            overdue > 0 ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {overdue}
          </span>
          <span className="text-xs text-cyber-muted">needs action</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
      </div>

      {/* Due in < 24 Hours */}
      <div className="col-span-2 sm:col-span-1 bg-[#14102A]/90 border border-white/[0.07] rounded-2xl p-4 relative overflow-hidden group hover:border-[#E5FE40]/40 transition-all duration-300">
        <div className="flex items-center justify-between text-cyber-muted mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Due Today</span>
          <Flame className="w-4 h-4 text-[#E5FE40]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold text-[#E5FE40] tracking-tight">
            {dueSoon}
          </span>
          <span className="text-xs text-cyber-muted">next 24 hours</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#E5FE40]/5 rounded-full blur-xl group-hover:bg-[#E5FE40]/10 transition-colors" />
      </div>
    </div>
  );
};
