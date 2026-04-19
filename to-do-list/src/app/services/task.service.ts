import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly storageKey = 'kanban_tasks';
  private tasksSignal = signal<Task[]>([]);

  tasks = this.tasksSignal.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTasks();

    effect(() => {
      this.saveTasks();
    });
  }

  private loadTasks() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          this.tasksSignal.set(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse tasks from localStorage', e);
          this.tasksSignal.set([]);
        }
      }
    }
  }

  private saveTasks() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasksSignal()));
    }
  }

  addTask(taskData: { title: string, description: string, priority: TaskPriority, dueDate: string }) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      status: 'todo',
      createdAt: Date.now()
    };
    this.tasksSignal.update(tasks => [...tasks, newTask]);
  }

  updateTask(updatedTask: Task) {
    this.tasksSignal.update(tasks => 
      tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    );
  }

  deleteTask(id: string) {
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
  }

  moveTask(id: string, newStatus: TaskStatus) {
    this.tasksSignal.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
    );
  }
}
