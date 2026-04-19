import { Component, input, output, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Task, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css'
})
export class TaskModalComponent {
  private fb = inject(FormBuilder);
  
  isOpen = input<boolean>(false);
  taskToEdit = input<Task | null>(null);
  
  closeModal = output<void>();
  saveTask = output<{ 
    title: string, 
    description: string, 
    priority: TaskPriority, 
    dueDate: string, 
    id?: string 
  }>();

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    priority: ['Medium' as TaskPriority, [Validators.required]],
    dueDate: ['', [Validators.required]]
  });

  descriptionCount = signal(0);

  constructor() {
    effect(() => {
      const task = this.taskToEdit();
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate
        });
        this.descriptionCount.set(task.description.length);
      } else {
        this.taskForm.reset({
          priority: 'Medium',
          title: '',
          description: '',
          dueDate: ''
        });
        this.descriptionCount.set(0);
      }
    });

    this.taskForm.get('description')?.valueChanges.subscribe(val => {
      this.descriptionCount.set(val?.length || 0);
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      this.saveTask.emit({
        title: formValue.title!,
        description: formValue.description!,
        priority: formValue.priority as TaskPriority,
        dueDate: formValue.dueDate!,
        id: this.taskToEdit()?.id
      });
      this.onClose();
    }
  }
}
