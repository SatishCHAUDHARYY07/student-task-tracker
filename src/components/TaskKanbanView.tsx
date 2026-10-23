import React from 'react';
import { Task, TaskStatus } from '../types/task';
import {
  getTaskUrgency,
  formatDateTime,
  getPriorityBadge,
  getTypeBadge,
} from '../utils/dateUtils';
import { CheckCircle2, Clock, PlayCircle, Edit2, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface TaskKanbanViewProps {
  tasks: Task[];
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
}

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onStartFocus,
}) => {
  const columns: { id: TaskStatus; title: string; color: string; border: string; icon: React.ReactNode }[] = [
    {
      id: 'pending',
      title: 'To Do (Pending)',
      color: 'text-[#00F0FF]',
      border: 'border-[#00F0FF]/30',
      icon: <Clock className="w-4 h-4 text-[#00F0FF]" />,
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'text-[#E5FE40]',
      border: 'border-[#E5FE40]/30',
      icon: <PlayCircle className="w-4 h-4 text-[#E5FE40]" />,
    },
    {
      id: 'completed',
      title: 'Completed & Submitted',
      color: 'text-emerald-400',
      border: 'border-emerald-400/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col bg-[#110D24]/80 border border-white/[0.07] rounded-2xl p-4 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]`}>
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className={`font-display text-lg font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white font-bold">
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards in Column */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="border border-dashed border-white/[0.08] rounded-xl p-8 text-center text-cyber-muted text-xs font-mono">
                  No tasks here
                </div>
              ) : (
                colTasks.map((task) => {
                  const urgency = getTaskUrgency(task);
                  const priority = getPriorityBadge(task.priority);
                  const type = getTypeBadge(task.type);

                  return (
                    <div
                      key={task.id}
                      className="group bg-[#171334] border border-white/[0.08] rounded-xl p-3.5 hover:border-cyber-cyan/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                            {task.course}
                          </span>
                          <span className="text-[10px] text-slate-300">
                            {type.icon}
                          </span>
                        </div>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${priority.className}`}>
                          {priority.label}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white group-hover:text-cyber-cyan leading-snug">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-cyber-muted mt-1.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-cyber-muted font-mono">
                        <span className={`px-1.5 py-0.5 rounded border ${urgency.badgeClass}`}>
                          {urgency.text}
                        </span>

                        <span className="text-[10px]">
                          {formatDateTime(task.dueDate)}
                        </span>
                      </div>

                      {/* Card Actions & Move Buttons */}
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-2">
                        <div className="flex items-center gap-1">
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => onStartFocus(task)}
                              title="Focus with Pomodoro"
                              className="p-1 text-cyber-muted hover:text-[#E5FE40]"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditTask(task)}
                            title="Edit"
                            className="p-1 text-cyber-muted hover:text-[#00F0FF]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            title="Delete"
                            className="p-1 text-cyber-muted hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Move state arrows */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'pending' && (
                            <button
                              onClick={() => onStatusChange(task, col.id === 'completed' ? 'in_progress' : 'pending')}
                              title="Move back"
                              className="px-1.5 py-0.5 text-[10px] rounded bg-white/[0.05] hover:bg-white/[0.1] text-cyber-muted hover:text-white flex items-center gap-0.5"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => onStatusChange(task, col.id === 'pending' ? 'in_progress' : 'completed')}
                              title="Advance state"
                              className="px-2 py-0.5 text-[10px] rounded bg-[#E5FE40]/20 hover:bg-[#E5FE40]/30 text-[#E5FE40] border border-[#E5FE40]/40 flex items-center gap-1 font-bold"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
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
  );
};
