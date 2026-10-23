import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Task, ViewMode, StatusFilter, SortOption, CourseInfo, TaskStatus } from './types/task';
import { INITIAL_TASKS, INITIAL_COURSES } from './data/initialTasks';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ViewControls } from './components/ViewControls';
import { TaskListView } from './components/TaskListView';
import { TaskKanbanView } from './components/TaskKanbanView';
import { TaskCalendarView } from './components/TaskCalendarView';
import { TaskModal } from './components/TaskModal';
import { PomodoroTimer } from './components/PomodoroTimer';
import { CheckCircle2, Sparkles, Plus } from 'lucide-react';

const STORAGE_KEY_TASKS = 'student_tracker_tasks_v1';
const STORAGE_KEY_COURSES = 'student_tracker_courses_v1';

export const App: React.FC = () => {
  // Initialize tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // Initialize courses
  const [courses, setCourses] = useState<CourseInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load courses from localStorage', e);
    }
    return INITIAL_COURSES;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  }, [courses]);

  // Controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDateAsc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Modal & focus states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Toast / notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error'; undoTask?: Task } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info', undoTask?: Task) => {
    setToast({ message, type, undoTask });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5FE40', '#00F0FF', '#10B981', '#A855F7'],
      });
    } catch {
      // ignore
    }
  };

  // Add or Edit Task handler
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    // If custom course entered, add to courses list if new
    if (taskData.course && !courses.some((c) => c.code === taskData.course)) {
      const newCourse: CourseInfo = {
        code: taskData.course,
        name: taskData.course,
        color: '#00F0FF',
      };
      setCourses((prev) => [...prev, newCourse]);
    }

    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                id: taskData.id,
              }
            : t
        )
      );
      showToast('Task updated successfully', 'success');
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('New assignment added to schedule', 'success');
    }
  };

  // Toggle Complete
  const handleToggleComplete = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );

    if (nextStatus === 'completed') {
      triggerConfetti();
      showToast(`Nice work! "${task.title}" completed 🎉`, 'success');
    } else {
      showToast(`Task reopened: "${task.title}"`, 'info');
    }
  };

  // Change Status (Kanban / Inline)
  const handleStatusChange = (task: Task, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    if (nextStatus === 'completed') {
      triggerConfetti();
      showToast(`Assignment completed! 🎉`, 'success');
    }
  };

  // Delete Task with Undo
  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted "${taskToDelete.title}"`, 'info', taskToDelete);
  };

  const handleUndoDelete = () => {
    if (toast?.undoTask) {
      setTasks((prev) => [toast.undoTask!, ...prev]);
      setToast(null);
      showToast('Task restored', 'success');
    }
  };

  // Edit Task Click
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Start Focus Mode with Task
  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
    setIsPomodoroOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Focus session started for: ${task.title}`, 'info');
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all tasks to original prototype demo data?')) {
      setTasks(INITIAL_TASKS);
      setCourses(INITIAL_COURSES);
      showToast('Demo tasks reloaded', 'info');
    }
  };

  // Export tasks as JSON
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student_tasks_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Tasks exported to JSON', 'success');
  };

  // Import tasks from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setTasks(imported);
          showToast(`Imported ${imported.length} tasks successfully`, 'success');
        } else {
          showToast('Invalid JSON file format', 'error');
        }
      } catch {
        showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesCourse = task.course.toLowerCase().includes(q);
          const matchesDesc = task.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCourse && !matchesDesc) return false;
        }

        // Course filter
        if (selectedCourse !== 'all' && task.course !== selectedCourse) {
          return false;
        }

        // Status filter
        if (statusFilter === 'pending') {
          return task.status === 'pending';
        }
        if (statusFilter === 'in_progress') {
          return task.status === 'in_progress';
        }
        if (statusFilter === 'completed') {
          return task.status === 'completed';
        }
        if (statusFilter === 'overdue') {
          return task.status !== 'completed' && new Date(task.dueDate).getTime() < now.getTime();
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'dueDateDesc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === 'priorityDesc') {
          const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'createdAtDesc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [tasks, searchQuery, selectedCourse, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col cyber-grid relative selection:bg-[#E5FE40] selection:text-black">
      {/* Top Header directly reflecting prototype slide */}
      <Header
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        onOpenPomodoro={() => setIsPomodoroOpen(!isPomodoroOpen)}
        isPomodoroOpen={isPomodoroOpen}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Optional Pomodoro Timer widget */}
        <PomodoroTimer
          isOpen={isPomodoroOpen}
          onClose={() => setIsPomodoroOpen(false)}
          activeTask={activeFocusTask}
          onClearActiveTask={() => setActiveFocusTask(null)}
        />

        {/* Stats Metrics Dashboard */}
        <StatsOverview tasks={tasks} />

        {/* View Controls & Filters */}
        <ViewControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          courses={courses}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredTasks.length}
        />

        {/* View Component based on selected mode */}
        {viewMode === 'list' && (
          <TaskListView
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditClick}
            onDeleteTask={handleDeleteTask}
            onStartFocus={handleStartFocus}
          />
        )}

        {viewMode === 'kanban' && (
          <TaskKanbanView
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEditTask={handleEditClick}
            onDeleteTask={handleDeleteTask}
            onStartFocus={handleStartFocus}
          />
        )}

        {viewMode === 'calendar' && (
          <TaskCalendarView
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditClick}
          />
        )}
      </main>

      {/* Clean Footer Bar */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#07050E] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-cyber-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5FE40]" />
            <span className="text-white font-semibold tracking-wider">STUDENT TASK & DEADLINE TRACKER</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyber-muted">All deadlines saved locally</span>
          </div>
        </div>
      </footer>

      {/* Floating Quick Action Button for Mobile */}
      <button
        onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 lg:hidden z-40 p-4 rounded-2xl bg-[#E5FE40] text-black shadow-neon-yellow hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        courses={courses}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#171334] border border-[#00F0FF]/40 text-white shadow-2xl glow-box-cyan animate-fade-in text-xs font-mono">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#00F0FF] shrink-0" />
          )}
          <span>{toast.message}</span>
          {toast.undoTask && (
            <button
              onClick={handleUndoDelete}
              className="ml-2 px-2 py-0.5 rounded bg-[#E5FE40] text-black font-bold uppercase text-[10px] hover:bg-[#efff5c]"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
};
