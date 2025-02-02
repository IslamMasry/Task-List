import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, Priority, TaskHistory } from '../types/task';
import { X, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

const priorities: Priority[] = ['Low', 'Medium', 'High'];

export function TaskEditModal({ task, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(format(task.dueDate, 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    setLoading(true);
    try {
      const changes: TaskHistory[] = [];
      
      if (title !== task.title) {
        changes.push({
          timestamp: new Date(),
          field: 'title',
          oldValue: task.title,
          newValue: title
        });
      }
      
      if (description !== task.description) {
        changes.push({
          timestamp: new Date(),
          field: 'description',
          oldValue: task.description,
          newValue: description
        });
      }
      
      if (priority !== task.priority) {
        changes.push({
          timestamp: new Date(),
          field: 'priority',
          oldValue: task.priority,
          newValue: priority
        });
      }
      
      if (new Date(dueDate).getTime() !== task.dueDate.getTime()) {
        changes.push({
          timestamp: new Date(),
          field: 'dueDate',
          oldValue: task.dueDate,
          newValue: new Date(dueDate)
        });
      }

      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        title,
        description,
        priority,
        dueDate: new Date(dueDate),
        updatedAt: new Date(),
        history: [...(task.history || []), ...changes]
      });
      
      toast.success('Task updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="View history"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showHistory && task.history && task.history.length > 0 && (
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Change History</h3>
            <div className="space-y-2">
              {task.history.map((change, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <span className="text-gray-400">{format(change.timestamp, 'MMM d, yyyy HH:mm')}</span>
                  {' - '}
                  Changed {change.field} from{' '}
                  <span className="font-medium">{
                    change.field === 'dueDate'
                      ? format(change.oldValue, 'MMM d, yyyy')
                      : change.oldValue
                  }</span>
                  {' to '}
                  <span className="font-medium">{
                    change.field === 'dueDate'
                      ? format(change.newValue, 'MMM d, yyyy')
                      : change.newValue
                  }</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority *
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}