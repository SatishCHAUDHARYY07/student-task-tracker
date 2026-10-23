import { Task, CourseInfo } from '../types/task';

// Dynamic dates relative to today
const now = new Date();
const formatDate = (daysOffset: number, hoursOffset: number = 0): string => {
  const target = new Date(now.getTime() + daysOffset * 86400000 + hoursOffset * 3600000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = target.getFullYear();
  const month = pad(target.getMonth() + 1);
  const day = pad(target.getDate());
  const hours = pad(target.getHours());
  const minutes = pad(target.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const INITIAL_COURSES: CourseInfo[] = [
  { code: 'CS 301', name: 'Algorithms & Data Structures', color: '#00F0FF' },
  { code: 'AI 420', name: 'Machine Learning & Neural Nets', color: '#E5FE40' },
  { code: 'MATH 220', name: 'Discrete Mathematics', color: '#A855F7' },
  { code: 'PHYS 201', name: 'Applied Quantum Physics', color: '#F43F5E' },
  { code: 'ENG 110', name: 'Technical Communication', color: '#10B981' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Graph Traversal & Dijkstra Algorithm Assignment',
    course: 'CS 301',
    type: 'assignment',
    dueDate: formatDate(0, 4), // Due today in 4 hours
    priority: 'urgent',
    status: 'in_progress',
    description: 'Implement shortest path routing in C++ with priority queue optimization. Write benchmark comparison report.',
    estimatedHours: 4,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Computer Vision Final Project Proposal',
    course: 'AI 420',
    type: 'project',
    dueDate: formatDate(1, 12), // Due tomorrow
    priority: 'high',
    status: 'pending',
    description: 'Draft the 3-page project milestone proposal on real-time pedestrian obstacle detection using YOLOv8.',
    estimatedHours: 6,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Quantum Entanglement Lab Report #4',
    course: 'PHYS 201',
    type: 'lab',
    dueDate: formatDate(-1, 0), // Overdue by 1 day
    priority: 'high',
    status: 'pending',
    description: 'Plot Bell inequality violation data curves and submit LaTeX write-up with experimental error calculations.',
    estimatedHours: 3,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Midterm Review & Proof Problem Set',
    course: 'MATH 220',
    type: 'exam',
    dueDate: formatDate(3, 8), // Due in 3 days
    priority: 'medium',
    status: 'pending',
    description: 'Solve induction, Pigeonhole Principle, and modular arithmetic practice exams from 2024-2025.',
    estimatedHours: 5,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Ethics in AI & Automation Oral Presentation',
    course: 'ENG 110',
    type: 'presentation',
    dueDate: formatDate(5, 14), // Due in 5 days
    priority: 'low',
    status: 'pending',
    description: 'Prepare a 10-minute slide deck reviewing autonomous vehicles decision frameworks and liability policies.',
    estimatedHours: 2.5,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Convolutional Neural Networks Homework 2',
    course: 'AI 420',
    type: 'assignment',
    dueDate: formatDate(-3, 0),
    priority: 'medium',
    status: 'completed',
    description: 'Trained ResNet-18 on CIFAR-10 achieving 92.4% validation accuracy. Submitted weights to portal.',
    estimatedHours: 8,
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Binary Search Tree & AVL Balancing Quiz',
    course: 'CS 301',
    type: 'exam',
    dueDate: formatDate(-2, 0),
    priority: 'urgent',
    status: 'completed',
    description: 'Scored 98/100 on tree rotation proofs and amortized complexity calculations.',
    estimatedHours: 2,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];
