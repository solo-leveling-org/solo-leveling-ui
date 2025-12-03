import React, { useState, useCallback, useEffect } from 'react';
import type { PlayerTask, CompleteTaskResponse, LocalizedField } from '../api';
import { PlayerTaskStatus as TaskStatus } from '../api';
import TasksGrid from './TasksGrid';
import TasksList from './TasksList';
import TaskDialog from './TaskDialog';
import TaskCompletionDialog from './TaskCompletionDialog';
import DateFilter from './DateFilter';
import FilterDropdown from './FilterDropdown';
import ResetFiltersButton from './ResetFiltersButton';
import { taskActions } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import ConfirmDialog from './ConfirmDialog';

type TasksSectionProps = {
  tasks: PlayerTask[];
  loading: boolean;
  firstTime: boolean;
  onTasksUpdate?: (tasks: PlayerTask[]) => void;
  onGoToTopics?: () => void;
  initialViewMode?: 'active' | 'completed';
};

type TaskViewMode = 'active' | 'completed';

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  loading,
  firstTime,
  onTasksUpdate,
  onGoToTopics,
  initialViewMode = 'active'
}) => {
  const [viewMode, setViewMode] = useState<TaskViewMode>(initialViewMode);
  
  // Синхронизируем viewMode с пропсом
  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);
  const [completionResponse, setCompletionResponse] = useState<CompleteTaskResponse | null>(null);
  const [completedTask, setCompletedTask] = useState<PlayerTask | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'complete' | 'replace';
    task: PlayerTask;
  } | null>(null);
  const [dateFilters, setDateFilters] = useState({ from: '', to: '' });
  const [enumFilters, setEnumFilters] = useState<{ [field: string]: string[] }>({});
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const { t } = useLocalization();

  const handleCompleteTask = useCallback(async (task: PlayerTask) => {
    setConfirmAction({ type: 'complete', task });
    setShowConfirmDialog(true);
  }, []);

  const completeTask = useCallback(async (task: PlayerTask) => {
    try {
      setTaskLoading(true);
      const response = await taskActions.completeTask(task);
      setCompletedTask(task);
      setCompletionResponse(response);
      // WebSocket уведомления автоматически обновят список задач через useTasksRefresh
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setTaskLoading(false);
    }
  }, []);

  const skipTask = useCallback(async (playerTask: PlayerTask) => {
    try {
      setTaskLoading(true);
      await taskActions.skipTask(playerTask);
      // WebSocket уведомления автоматически обновят список задач через useTasksRefresh
    } catch (error) {
      console.error('Error skipping task:', error);
    } finally {
      setTaskLoading(false);
    }
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmAction) {
      if (confirmAction.type === 'complete') {
        completeTask(confirmAction.task);
      } else if (confirmAction.type === 'replace') {
        skipTask(confirmAction.task);
      }
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  }, [confirmAction, completeTask, skipTask]);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  }, []);

  // Обработчики фильтров
  const handleDateFilterChange = useCallback((from: string, to: string) => {
    setDateFilters({ from, to });
  }, []);

  const handleEnumFilterChange = useCallback((field: string, values: string[]) => {
    setEnumFilters(prev => ({
      ...prev,
      [field]: values
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateFilters({ from: '', to: '' });
    setEnumFilters({});
  }, []);

  const handleFiltersUpdate = useCallback((filters: LocalizedField[]) => {
    setAvailableFilters(filters);
  }, []);

  // Мемоизируем обработчики для TasksGrid и TasksList
  const handleTaskClick = useCallback((playerTask: PlayerTask) => {
    if (playerTask.task) setDialogTask(playerTask);
  }, []);

  const handleReplace = useCallback(async (playerTask: PlayerTask) => {
    if (taskLoading) return;
    setConfirmAction({ type: 'replace', task: playerTask });
    setShowConfirmDialog(true);
  }, [taskLoading]);

  // Показываем empty state для первого раза
  if (firstTime) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 md:px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Empty state */}
          <div className="py-12 px-4">
            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.2) 0%, rgba(160, 210, 235, 0.15) 100%)',
                border: '2px solid rgba(220, 235, 245, 0.3)',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.3)'
              }}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                color: '#e8f4f8',
                filter: 'drop-shadow(0 0 4px rgba(180, 220, 240, 0.5))'
              }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>

            {/* Title */}
            <h2
              className="text-2xl sm:text-3xl font-tech font-bold mb-4"
              style={{
                color: '#e8f4f8',
                textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
              }}
            >
              {t('tasks.noTasks.title')}
            </h2>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto"
              style={{
                color: 'rgba(220, 235, 245, 0.7)'
              }}
            >
              {t('tasks.noTasks.subtitle')}
            </p>

            {/* Action button */}
            {onGoToTopics && (
              <button
                onClick={onGoToTopics}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-tech text-sm tracking-[0.15em] uppercase transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(220, 235, 245, 0.3)',
                  boxShadow: '0 0 20px rgba(180, 220, 240, 0.2)',
                  color: '#e8f4f8'
                }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {t('tasks.noTasks.button')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Фильтры для завершенных задач */}
      {viewMode === 'completed' && (
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 filters-scrollbar">
            {/* Date Range Filter */}
            <DateFilter
              from={dateFilters.from}
              to={dateFilters.to}
              onChange={handleDateFilterChange}
            />

            {/* Enum Filters */}
            {availableFilters.map((filter) => (
              <FilterDropdown
                key={filter.field}
                label={filter.localization}
                options={filter.items}
                selectedValues={enumFilters[filter.field] || []}
                onSelectionChange={(values) => handleEnumFilterChange(filter.field, values)}
              />
            ))}

            {/* Clear Filters Button */}
            <ResetFiltersButton onClick={handleClearFilters} />
          </div>
        </div>
      )}

      {/* Tasks Grid or List */}
      {viewMode === 'active' ? (
        <TasksGrid
          tasks={tasks}
          loading={loading || taskLoading}
          onTaskClick={handleTaskClick}
          onComplete={handleCompleteTask}
          onReplace={handleReplace}
        />
      ) : (
        <TasksList
          statusFilter={[TaskStatus.COMPLETED, TaskStatus.SKIPPED]}
          dateFilters={dateFilters}
          enumFilters={enumFilters}
          onFiltersUpdate={handleFiltersUpdate}
          onTaskClick={handleTaskClick}
        />
      )}

      {dialogTask && dialogTask.task && (
        <TaskDialog
          task={dialogTask.task}
          status={dialogTask.status}
          createdAt={dialogTask.createdAt}
          onClose={() => setDialogTask(null)}
          isOpen={!!dialogTask}
        />
      )}

      {completionResponse && (
        <TaskCompletionDialog
          response={completionResponse}
          completedTask={completedTask?.task}
          onClose={() => {
            setCompletionResponse(null);
            setCompletedTask(null);
          }}
          isOpen={!!completionResponse}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message={confirmAction?.type === 'complete'
          ? t('tasks.confirm.complete')
          : t('tasks.confirm.replace')
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
        confirmText={confirmAction?.type === 'complete'
          ? t('tasks.buttons.complete')
          : t('tasks.buttons.replace')
        }
        cancelText={t('common.cancel')}
      />
    </>
  );
};

export default TasksSection;

