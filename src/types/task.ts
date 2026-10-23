export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskType = 'assignment' | 'project' | 'exam' | 'lab' | 'reading' | 'presentation';

export interface Task {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  dueDate: string; // ISO string YYYY-MM-DDTHH:mm
  priority: Priority;
  status: TaskStatus;
  description?: string;
  estimatedHours?: number;
  completedAt?: string;
  createdAt: string;
}

export interface CourseInfo {
  code: string;
  name: string;
  color: string; // Hex or tailwind badge style
}

export type ViewMode = 'list' | 'kanban' | 'calendar';
export type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue';
export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'titleAsc' | 'createdAtDesc';
