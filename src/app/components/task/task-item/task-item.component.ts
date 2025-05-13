// src/app/task-item/task-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTooltipModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskUpdated = new EventEmitter<Task>();
  isEditing = false;
  editedTitle = '';

  startEditing(): void {
    this.isEditing = true;
    this.editedTitle = this.task.title;
  }

  saveChanges(): void {
    if (this.editedTitle.trim()) {
      this.taskUpdated.emit({
        ...this.task,
        title: this.editedTitle.trim()
      });
      this.isEditing = false;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  toggleCompleted(): void {
    this.taskUpdated.emit({
      ...this.task,
      completed: !this.task.completed
    });
  }
}