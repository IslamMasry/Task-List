import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, Priority } from '../types/task';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { TaskEditModal } from './TaskEditModal';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    primary: 'priority' | 'dueDate';
    secondary: 'priority' | 'dueDate' | null;
    direction: 'asc' | 'desc';
  }>({
    primary: 'dueDate',
    secondary: null,
    direction: 'asc'
  });
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy(sortConfig.primary, sortConfig.direction));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          ...data,
          dueDate: data.dueDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          history: (data.history || []).map((h: any) => ({
            ...h,
            timestamp: h.timestamp.toDate()
          }))
        } as Task);
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [sortConfig.primary, sortConfig.direction]);

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const history = [...(task.history || []), {
        timestamp: new Date(),
        field: 'completed',
        oldValue: task.completed,
        newValue: completed
      }];

      await updateDoc(taskRef, {
        completed,
        status: completed ? 'Completed' : 'Pending',
        updatedAt: new Date(),
        history
      });
      toast.success(`Task ${completed ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return tasksToSort.sort((a, b) => {
      const priorityOrder = { 'Low': 0, 'Medium': 1, 'High': 2 };
      
      // Primary sort
      let comparison = 0;
      if (sortConfig.primary === 'priority') {
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        comparison = a.dueDate.getTime() - b.dueDate.getTime();
        if (sortConfig.direction === 'desc') comparison *= -1;
      }

      // Secondary sort
      if (comparison === 0 && sortConfig.secondary) {
        if (sortConfig.secondary === 'priority') {
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        } else {
          comparison = a.dueDate.getTime() - b.dueDate.getTime();
        }
      }

      return comparison;
    });
  };

  const filteredAndSortedTasks = sortTasks(
    tasks.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize);
  const paginatedTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const isOverdue = (task: Task) => {
    return !task.completed && new Date() > task.dueDate;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4">
          <select
            value={sortConfig.primary}
            onChange={(e) => setSortConfig(prev => ({
              ...prev,
              primary: e.target.value as 'priority' | 'dueDate'
            }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority (High → Low)</option>
          </select>
          <select
            value={sortConfig.secondary || ''}
            onChange={(e) => setSortConfig(prev => ({
              ...prev,
              secondary: e.target.value as 'priority' | 'dueDate' | null || null
            }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">No secondary sort</option>
            <option value="dueDate" disabled={sortConfig.primary === 'dueDate'}>
              Then by Due Date
            </option>
            <option value="priority" disabled={sortConfig.primary === 'priority'}>
              Then by Priority
            </option>
          </select>
          {sortConfig.primary === 'dueDate' && (
            <select
              value={sortConfig.direction}
              onChange={(e) => setSortConfig(prev => ({
                ...prev,
                direction: e.target.value as 'asc' | 'desc'
              }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}
        </div>
        <input
          type="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTasks.map((task) => (
                <tr 
                  key={task.id}
                  className={clsx(
                    'hover:bg-gray-50 transition-colors duration-150',
                    task.completed && 'bg-gray-50',
                    isOverdue(task) && 'bg-red-50'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                      className={clsx(
                        'p-1 rounded-full transition-colors duration-150',
                        task.completed ? 'hover:bg-green-100' : 'hover:bg-gray-100'
                      )}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : isOverdue(task) ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className={clsx(
                      'text-sm font-medium',
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900',
                      isOverdue(task) && !task.completed && 'text-red-600'
                    )}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className={clsx(
                        'text-sm',
                        task.completed ? 'line-through text-gray-400' : 'text-gray-500'
                      )}>
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getPriorityColor(task.priority)
                    )}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'text-sm',
                      isOverdue(task) && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'
                    )}>
                      {format(task.dueDate, 'MMM d, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors duration-150 inline-flex"
                      title="Edit task"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-150 inline-flex"
                      title="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-4">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedTasks.length)} of {filteredAndSortedTasks.length} tasks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}