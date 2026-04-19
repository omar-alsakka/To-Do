import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './column.html',
  styleUrl: './column.css'
})
export class ColumnComponent {
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();
  iconType = input.required<'todo' | 'inprogress' | 'completed'>();

  deleteTask = output<string>();
  editTask = output<Task>();
  moveTask = output<{ id: string, newStatus: TaskStatus }>();

  onDelete(id: string) {
    this.deleteTask.emit(id);
  }

  onEdit(task: Task) {
    this.editTask.emit(task);
  }

  onMove(event: { id: string, newStatus: TaskStatus }) {
    this.moveTask.emit(event);
  }
}
