// src/app/components/auth/navbar/navbar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() tasksCleared = new EventEmitter<void>(); // Declaramos el Output
  constructor(
    public authService: AuthService,
    private router: Router,
    private taskService: TaskService
  ) {}

  logout(): void {
    // Limpiar tareas antes de cerrar sesión si es necesario
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async clearTasks(): Promise<void> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    if (confirm('¿Estás seguro de que quieres borrar todas tus tareas?')) {
      try {
        await this.taskService.clearUserTasks(userId).toPromise();
        this.tasksCleared.emit(); // Emitimos el evento
      } catch (error) {
        console.error('Error al limpiar tareas:', error);
      }
    }
  }
}