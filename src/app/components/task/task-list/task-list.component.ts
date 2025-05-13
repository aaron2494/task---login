// src/app/task-list/task-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Task, TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, AddTaskComponent, NgbAlertModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  filter: 'all' | 'completed' | 'pending' = 'all';

 private authService = inject(AuthService);
  private taskService = inject(TaskService);
  
  constructor() {}

  ngOnInit(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      this.loadTasks(userId);
    }
  }

    loadTasks(userId: number): void {
    this.isLoading = true;
    this.taskService.getTasks(userId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las tareas';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    switch (this.filter) {
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      case 'pending':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

handleTaskAdded(newTaskData: { title: string, completed?: boolean }): void {
  const userId = this.authService.currentUserValue?.id;
  
  if (!userId) {
    this.errorMessage = 'Usuario no autenticado';
    return;
  }

  this.taskService.addTask(newTaskData, userId).subscribe({
    next: (task) => {
      this.tasks.unshift(task);
      this.applyFilter();
    },
    error: () => {
      this.errorMessage = 'Error al agregar la tarea';
    }
  });
}
  handleTaskDeleted(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar la tarea';
      }
    });
  }

  handleTaskUpdated(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask).subscribe({
      next: (task) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = task;
          this.applyFilter();
        }
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la tarea';
      }
    });
  }
  handleTasksCleared(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    // Cargar tareas sin defaults
    this.taskService.getTasks(userId, false).subscribe({
        next: (tasks) => {
            this.tasks = tasks;
            this.applyFilter();
        },
        error: (err) => {
            this.errorMessage = 'Error al cargar tareas';
        }
    });
}
}