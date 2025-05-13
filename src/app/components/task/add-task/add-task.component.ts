// src/app/components/task/add-task/add-task.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  @Output() taskAdded = new EventEmitter<{ title: string, completed?: boolean }>();
  newTaskTitle = '';

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskAdded.emit({
        title: this.newTaskTitle.trim(),
        completed: false
      });
      this.newTaskTitle = '';
    }
  }
}