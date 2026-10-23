import React from 'react';
import { Task } from '../types/task';
import {
  getTaskUrgency,
  formatDateTime,
  getPriorityBadge,
  getTypeBadge,
} from '../utils/dateUtils';
import {
  Check,
  Edit2,
  Trash2,
  Clock,
  Play,
  Calendar,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onStartFocus,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-[#120F26]/70 border border-white/[0.06] rounded-2xl p-12 text-center my-6">
        <FolderGit2 className="w-12 h-12 text-cyber-muted mx-auto mb-3 opacity-40" />
        <h3 className="font-display text-xl text-white font-bold tracking-wide">NO TASKS FOUND</h3>
        <p className="text-sm text-cyber-muted max-w-sm mx-auto mt-1">
          No assignments match your current filter. Try clearing filters or create a new task.
        </p>
      </div>
    );
  }

  // Group tasks by urgency bucket for maximum clarity
  const now = new Date();
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && new Date(t.dueDate).getTime() < now.getTime());
  const dueTodayTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const diffHours = (new Date(t.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 24;
  });
  const upcomingTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const diffHours = (new Date(t.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  });
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const renderTaskCard = (task: Task) => {
    const urgency = getTaskUrgency(task);
    const priority = getPriorityBadge(task.priority);
    const type = getTypeBadge(task.type);
    const isCompleted = task.status === 'completed';

    return (
      <div
        key={task.id}
        className={`group relative bg-[#14102A]/90 border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:border-cyber-cyan/40 hover:bg-[#181432] shadow-sm ${
          isCompleted
            ? 'border-white/[0.04] opacity-70 bg-[#0E0B1D]/60'
            : urgency.status === 'overdue'
            ? 'border-rose-500/30 bg-[#160E22]/90'
            : 'border-white/[0.08]'
        }`}
      >
        <div className="flex items-start gap-3.5 sm:gap-4">
          {/* Custom Checkbox Toggle */}
          <button
            onClick={() => onToggleComplete(task)}
            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
            className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'border-white/20 bg-white/[0.02] hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 text-transparent'
            }`}
          >
            <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-black' : ''}`} />
          </button>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Course Tag */}
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25">
                {task.course}
              </span>

              {/* Type Badge */}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/[0.08] flex items-center gap-1">
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </span>

              {/* Priority Badge */}
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${priority.className}`}>
                {priority.label}
              </span>

              {/* Urgency Badge */}
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${urgency.badgeClass}`}>
                <Clock className="w-3 h-3" />
                <span>{urgency.text}</span>
              </span>

              {task.estimatedHours && (
                <span className="text-[11px] font-mono text-cyber-muted ml-auto hidden sm:inline-block">
                  ~{task.estimatedHours}h effort
                </span>
              )}
            </div>

            {/* Task Title */}
            <h4
              className={`text-base font-semibold leading-snug transition-colors ${
                isCompleted ? 'line-through text-slate-400' : 'text-white group-hover:text-cyber-cyan'
              }`}
            >
              {task.title}
            </h4>

            {/* Description Notes if present */}
            {task.description && (
              <p className="text-xs text-cyber-muted mt-1.5 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Bottom meta row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-cyber-muted">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Due: {formatDateTime(task.dueDate)}</span>
              </span>

              {task.status === 'in_progress' && (
                <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  In Progress
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 self-start sm:self-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {!isCompleted && (
              <button
                onClick={() => onStartFocus(task)}
                title="Start Focus Session"
                className="p-2 text-cyber-muted hover:text-[#E5FE40] hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
            <button
              onClick={() => onEditTask(task)}
              title="Edit Task"
              className="p-2 text-cyber-muted hover:text-[#00F0FF] hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              title="Delete Task"
              className="p-2 text-cyber-muted hover:text-rose-400 hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span>Overdue Deadlines ({overdueTasks.length})</span>
          </div>
          <div className="space-y-2.5">{overdueTasks.map(renderTaskCard)}</div>
        </div>
      )}

      {/* Due Today Section */}
      {dueTodayTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#E5FE40] uppercase">
            <Clock className="w-4 h-4" />
            <span>Due Within 24 Hours ({dueTodayTasks.length})</span>
          </div>
          <div className="space-y-2.5">{dueTodayTasks.map(renderTaskCard)}</div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#00F0FF] uppercase">
            <Calendar className="w-4 h-4" />
            <span>Upcoming Assignments ({upcomingTasks.length})</span>
          </div>
          <div className="space-y-2.5">{upcomingTasks.map(renderTaskCard)}</div>
        </div>
      )}

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            <Check className="w-4 h-4" />
            <span>Completed & Submitted ({completedTasks.length})</span>
          </div>
          <div className="space-y-2.5">{completedTasks.map(renderTaskCard)}</div>
        </div>
      )}
    </div>
  );
};
