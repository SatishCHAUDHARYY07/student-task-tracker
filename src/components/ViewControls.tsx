import React from 'react';
import { ViewMode, StatusFilter, SortOption, CourseInfo } from '../types/task';
import {
  Search,
  ListFilter,
  LayoutGrid,
  Calendar,
  Layers,
  ArrowUpDown,
  X,
} from 'lucide-react';

interface ViewControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  courses: CourseInfo[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCourse,
  onCourseChange,
  courses,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Search + View Mode Switcher + Course Filter + Sort */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assignments, topics, courses..."
            className="w-full bg-[#14102A]/90 border border-white/[0.08] rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]/60 focus:ring-1 focus:ring-[#00F0FF]/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course selector */}
          <div className="flex items-center gap-1.5 bg-[#14102A]/90 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-cyber-muted">
            <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-[#14102A] text-white">All Courses</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#14102A] text-white">
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-[#14102A]/90 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-cyber-muted">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#E5FE40]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="dueDateAsc" className="bg-[#14102A] text-white">Due Date (Earliest)</option>
              <option value="dueDateDesc" className="bg-[#14102A] text-white">Due Date (Latest)</option>
              <option value="priorityDesc" className="bg-[#14102A] text-white">Priority (Highest)</option>
              <option value="titleAsc" className="bg-[#14102A] text-white">Title (A - Z)</option>
              <option value="createdAtDesc" className="bg-[#14102A] text-white">Recently Created</option>
            </select>
          </div>

          {/* View Mode Toggle: List, Kanban, Calendar */}
          <div className="flex items-center bg-[#14102A]/90 border border-white/[0.08] p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#E5FE40] text-black shadow-neon-yellow font-bold'
                  : 'text-cyber-muted hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              onClick={() => onViewModeChange('kanban')}
              title="Kanban Board View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-[#00F0FF] text-black shadow-neon-cyan font-bold'
                  : 'text-cyber-muted hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>

            <button
              onClick={() => onViewModeChange('calendar')}
              title="Calendar Schedule View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#A855F7] text-white shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)] font-bold'
                  : 'text-cyber-muted hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {(
            [
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
              { key: 'overdue', label: 'Overdue' },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onStatusFilterChange(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#1E1940] text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_10px_-2px_rgba(0,240,255,0.25)]'
                    : 'text-cyber-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-cyber-muted shrink-0 pl-4">
          Showing <strong className="text-white">{totalFilteredCount}</strong> items
        </span>
      </div>
    </div>
  );
};
