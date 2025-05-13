import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guards';

export const routes: Routes = [

    {
      canActivateChild:[publicGuard()],
        path:"auth",
        loadChildren:() => import("./auth/features/auth.routes"),
    },
 {
   canActivateChild:[privateGuard()],
    path:"task",
    loadComponent:() => import("./shared/ui/layout.component"),
    loadChildren:()=> import("./task/task.routes"),
 },
 {
    path:"**",
    redirectTo:"/task",
 }
];
