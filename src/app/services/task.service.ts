// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly LOCAL_STORAGE_KEY = 'tasks';

  constructor(
    private http: HttpClient
  ) {}

  private getLocalTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  private saveLocalTasks(tasks: Task[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

    getTasks(userId: number, loadDefaults = true): Observable<Task[]> {
    const userTasks = this.getLocalTasks().filter(task => task.userId === userId);
    
   // Solo cargar tareas por defecto si loadDefaults es true y no hay tareas
    if (loadDefaults && userTasks.length === 0) {
        const defaultTasks: Task[] = [
            { id: 1, title: 'Mi primera tarea', completed: false, userId },
            { id: 2, title: 'Tarea completada', completed: true, userId }
        ];
        this.saveLocalTasks([...this.getLocalTasks(), ...defaultTasks]);
        return of(defaultTasks);
    }

    return of(userTasks);
}

  addTask(taskData: { title: string, completed?: boolean }, userId: number): Observable<Task> {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title.trim(),
      completed: taskData.completed || false,
      userId, // userId se recibe como parámetro separado
      createdAt: new Date()
    };

    const allTasks = this.getLocalTasks();
    allTasks.unshift(newTask);
    this.saveLocalTasks(allTasks);

    return of(newTask);
  }
  updateTask(task: Task): Observable<Task> {
    const allTasks = this.getLocalTasks();
    const index = allTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      allTasks[index] = {
        ...allTasks[index],
        ...task
      };
      this.saveLocalTasks(allTasks);
    }
    
    return of(task);
  }

  deleteTask(id: number): Observable<void> {
    const allTasks = this.getLocalTasks();
    const updatedTasks = allTasks.filter(t => t.id !== id);
    this.saveLocalTasks(updatedTasks);
    return of(void 0);
  }

clearUserTasks(userId: number): Observable<void> {
    const allTasks = this.getLocalTasks();
    const otherUsersTasks = allTasks.filter(task => task.userId !== userId);
    this.saveLocalTasks(otherUsersTasks);
    return of(void 0);
}
}