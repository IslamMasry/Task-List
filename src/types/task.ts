export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Completed' | 'Overdue' | 'Pending';

export interface TaskHistory {
  timestamp: Date;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: Date;
  status: Status;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  history: TaskHistory[];
}