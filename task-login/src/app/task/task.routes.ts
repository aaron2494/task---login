import { Routes } from "@angular/router"

export default [
    { 
        path:"",
        loadComponent:() => import("./features/task-list/task-list.component")
     },
     {
        path:"new",
        loadComponent:() => import("./features/task-form/task-form.component")
     },
     {
        path:"edit/:idTask",
        loadComponent:() => import("./features/task-form/task-form.component")
     },
] as Routes