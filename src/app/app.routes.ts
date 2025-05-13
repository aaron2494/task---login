import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task/task-list/task-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      { path: '', component: TaskListComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
