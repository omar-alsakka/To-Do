import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { KanbanBoardComponent } from './components/board/board';
import { TaskModalComponent } from './components/task-modal/task-modal';
import { TaskService } from './services/task.service';
import { Task, TaskPriority } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    KanbanBoardComponent,
    TaskModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private taskService = inject(TaskService);
  
  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);

  openAddModal() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  handleSaveTask(event: { title: string, description: string, priority: TaskPriority, dueDate: string, id?: string }) {
    if (event.id) {
      const existingTask = this.taskService.tasks().find(t => t.id === event.id);
      if (existingTask) {
        this.taskService.updateTask({
          ...existingTask,
          title: event.title,
          description: event.description,
          priority: event.priority,
          dueDate: event.dueDate
        });
      }
    } else {
      this.taskService.addTask(event);
    }
    this.closeModal();
  }
}
