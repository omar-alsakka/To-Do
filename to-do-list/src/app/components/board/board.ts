import { Component, inject, computed, output } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ColumnComponent } from '../column/column';
import { Task, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent],
  templateUrl: './board.html',
  styleUrl: './board.css'
})
export class KanbanBoardComponent {
  private taskService = inject(TaskService);
  
  editTask = output<Task>();

  todoTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'todo'));
  inprogressTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'inprogress'));
  completedTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'completed'));

  onDeleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onMoveTask(event: { id: string, newStatus: TaskStatus }) {
    this.taskService.moveTask(event.id, event.newStatus);
  }
}
