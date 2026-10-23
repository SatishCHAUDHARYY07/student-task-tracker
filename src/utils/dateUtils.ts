import { Task, Priority } from '../types/task';

export interface UrgencyInfo {
  status: 'overdue' | 'due-today' | 'due-soon' | 'upcoming' | 'completed';
  text: string;
  badgeClass: string;
}

export function getTaskUrgency(task: Task): UrgencyInfo {
  if (task.status === 'completed') {
    return {
      status: 'completed',
      text: 'Completed',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    };
  }

  const now = new Date();
  const due = new Date(task.dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      status: 'overdue',
      text: overdueDays <= 1 ? 'Overdue today' : `Overdue by ${overdueDays}d`,
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
    };
  }

  if (diffHours <= 24) {
    if (diffHours < 1) {
      const mins = Math.max(1, Math.round(diffMs / (1000 * 60)));
      return {
        status: 'due-today',
        text: `Due in ${mins}m`,
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
      };
    }
    return {
      status: 'due-today',
      text: `Due in ${Math.round(diffHours)}h`,
      badgeClass: 'bg-[#E5FE40]/20 text-[#E5FE40] border-[#E5FE40]/40 font-semibold',
    };
  }

  if (diffDays <= 3) {
    return {
      status: 'due-soon',
      text: `Due in ${diffDays} days`,
      badgeClass: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30',
    };
  }

  return {
    status: 'upcoming',
    text: `Due in ${diffDays} days`,
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  };
}

export function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export function getPriorityBadge(priority: Priority): { label: string; className: string } {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        className: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
      };
    case 'high':
      return {
        label: 'High',
        className: 'bg-[#E5FE40]/20 text-[#E5FE40] border border-[#E5FE40]/40',
      };
    case 'medium':
      return {
        label: 'Medium',
        className: 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30',
      };
    case 'low':
    default:
      return {
        label: 'Low',
        className: 'bg-slate-700/50 text-slate-300 border border-slate-600/40',
      };
  }
}

export function getTypeBadge(type: Task['type']): { label: string; icon: string } {
  switch (type) {
    case 'assignment':
      return { label: 'Assignment', icon: '📝' };
    case 'project':
      return { label: 'Project', icon: '🚀' };
    case 'exam':
      return { label: 'Exam / Quiz', icon: '🎯' };
    case 'lab':
      return { label: 'Lab Report', icon: '🔬' };
    case 'presentation':
      return { label: 'Presentation', icon: '🎤' };
    case 'reading':
      return { label: 'Reading', icon: '📖' };
    default:
      return { label: 'Task', icon: '📌' };
  }
}
