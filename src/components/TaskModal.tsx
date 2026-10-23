import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskType, TaskStatus, CourseInfo } from '../types/task';
import { X, Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  initialTask?: Task | null;
  courses: CourseInfo[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  courses,
}) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('CS 301');
  const [customCourse, setCustomCourse] = useState('');
  const [type, setType] = useState<TaskType>('assignment');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>(2);
  const [error, setError] = useState('');

  // Default to tomorrow 11:59 PM when creating
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(23, 59, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T23:59`;
  };

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      const isKnownCourse = courses.some((c) => c.code === initialTask.course);
      if (isKnownCourse) {
        setCourse(initialTask.course);
        setCustomCourse('');
      } else {
        setCourse('other');
        setCustomCourse(initialTask.course);
      }
      setType(initialTask.type);
      setDueDate(initialTask.dueDate.slice(0, 16));
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDescription(initialTask.description || '');
      setEstimatedHours(initialTask.estimatedHours || 2);
    } else {
      setTitle('');
      setCourse(courses[0]?.code || 'CS 301');
      setCustomCourse('');
      setType('assignment');
      setDueDate(getDefaultDueDate());
      setPriority('high');
      setStatus('pending');
      setDescription('');
      setEstimatedHours(2);
    }
    setError('');
  }, [initialTask, isOpen, courses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }
    if (!dueDate) {
      setError('Please pick a due date and time.');
      return;
    }

    const finalCourse = course === 'other' ? (customCourse.trim() || 'General') : course;

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      course: finalCourse,
      type,
      dueDate,
      priority,
      status,
      description: description.trim(),
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#120F26] border border-cyber-border rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden glow-box-cyan">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E5FE40]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5FE40] shadow-neon-yellow" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
              {initialTask ? 'Edit Task & Deadline' : 'Create Student Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5">
              Task / Assignment Title <span className="text-[#E5FE40]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dijkstra Routing Lab Report"
              className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5FE40] focus:ring-1 focus:ring-[#E5FE40]/30 transition-all"
            />
          </div>

          {/* Course & Task Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5">
                Course / Subject <span className="text-[#00F0FF]">*</span>
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-all"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
                <option value="other">+ Custom Course</option>
              </select>
              {course === 'other' && (
                <input
                  type="text"
                  placeholder="Enter Course Code (e.g. BIO 101)"
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="mt-2 w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-all"
              >
                <option value="assignment">📝 Assignment</option>
                <option value="project">🚀 Final Project</option>
                <option value="exam">🎯 Exam / Quiz</option>
                <option value="lab">🔬 Lab Report</option>
                <option value="presentation">🎤 Presentation</option>
                <option value="reading">📖 Reading</option>
              </select>
            </div>
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E5FE40]" />
                Due Date & Time <span className="text-[#E5FE40]">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#E5FE40] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-400 transition-all font-medium"
              >
                <option value="urgent" className="text-rose-400">🔥 Urgent (Top Priority)</option>
                <option value="high" className="text-[#E5FE40]">⚡ High</option>
                <option value="medium" className="text-[#00F0FF]">🔹 Medium</option>
                <option value="low" className="text-slate-400">⚪ Low</option>
              </select>
            </div>
          </div>

          {/* Status & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-all"
              >
                <option value="pending">⏳ Pending (To Do)</option>
                <option value="in_progress">⚙️ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyber-muted" />
                Estimated Effort (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours ?? ''}
                onChange={(e) => setEstimatedHours(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g. 3"
                className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#00F0FF] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-cyber-muted mb-1.5">
              Assignment Notes / Submission Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Must include citation in IEEE format. Submit PDF to Canvas."
              className="w-full bg-[#181432] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] transition-all"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-cyber-muted hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-[#E5FE40] text-black shadow-neon-yellow hover:bg-[#efff5c] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{initialTask ? 'Save Changes' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
