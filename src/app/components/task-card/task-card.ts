import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCardComponent {
  task = input.required<Task>();
  
  deleteClicked = output<string>();
  editClicked = output<Task>();
  statusChanged = output<{ id: string, newStatus: TaskStatus }>();

  get shortId() {
    return this.task().id.substring(0, 4).toUpperCase();
  }

  onDelete() {
    this.deleteClicked.emit(this.task().id);
  }

  onEdit() {
    this.editClicked.emit(this.task());
  }

  onMove(newStatus: TaskStatus) {
    this.statusChanged.emit({ id: this.task().id, newStatus });
  }
}
