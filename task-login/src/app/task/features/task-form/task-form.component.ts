import { Component, effect, inject, Input, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreate, TaskService } from '../../data-acces/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styles: ``,
  providers: [TaskService]
})
export default class TaskFormComponent {
  
  private _formBuilder = inject(FormBuilder);
  private _taskService= inject(TaskService);
  private _router= inject (Router);

  loading= signal(false)

  @Input() idTask!: string; 

  form = this._formBuilder.group({
    title: ["", Validators.required],
    completed: [false, Validators.required]
  });

  constructor(){
    effect(()=>{
      const id = this.idTask;
      if(id){
        this.getTask(id);
      }
    })
  }
  async getTask(id:string){
    const taskSnapshot = await this._taskService.getTask(id)
    if(!taskSnapshot.exists())return
    const task =taskSnapshot.data() as Task;
    this.form.patchValue(task);
  }

  async submit(){
if (this.form.invalid)return 

try {
  this.loading.set(true)
  const{ title,completed } = this.form.value;
  const task:TaskCreate={
    title: title||"",
    completed: !!completed,   
  };
  const id = this.idTask;
  if(id){
    await this._taskService.update(task,id)
  }else{
    await this._taskService.create(task)
  }
 

  toast.success(`tarea ${id ? "actualizada" : "creada"} correctamente.`)
  this._router.navigateByUrl("/task")
} catch (error) {
  toast.error("ocurrio un problema")
}finally{
  this.loading.set(true)
}
  }
    // Método para eliminar una tarea
    async deleteTask() {
      const id = this.idTask;
      if (!id) return; // Si no hay ID, no se puede eliminar.
  
      try {
        this.loading.set(true);
        await this._taskService.deleteTask({ id, title: '', completed: false });  // Pasamos un objeto Task con el id
        toast.success('Tarea eliminada correctamente.');
        this._router.navigateByUrl("/task");
      } catch (error) {
        toast.error('Ocurrió un problema al eliminar la tarea.');
      } finally {
        this.loading.set(false);
      }
    }
}
