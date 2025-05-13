import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import {  toSignal} from "@angular/core/rxjs-interop";
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Task{
  id: string;
  title:string;
  completed:boolean;
}

export type TaskCreate = Omit<Task,"id">;

const PATH="tasks"

@Injectable()
export class TaskService {

  private _authState=inject(AuthStateService);

 private _firestore=inject(Firestore);

 private _collection= collection(this._firestore,PATH);

 private _query = query(
  this._collection,
  where('userId', '==', this._authState.currentUser?.uid)
);
 loading = signal<boolean>(true)

 getTasks = toSignal(
  (collectionData(this._query, { idField: "id" }) as Observable<Task[]>).pipe(
    tap((tasks) => {
      console.log('Fetched tasks:', tasks); // Agrega este log
      this.loading.set(false);
    }),
    catchError((error) => {
      this.loading.set(false);
      return throwError(() => error);
    })
  ),
  {
    initialValue: []
  }
);
constructor(){
 console.log (this._authState.currentUser)
}

update(task:TaskCreate,id:string){
  const docRef= doc(this._collection,id);
  return updateDoc(docRef,{...task,userId:this._authState.currentUser?.uid,});
}

getTask(id:string){
  const docRef = doc(this._collection,id)
  return getDoc(docRef)
}
deleteTask(task: Task) { // Cambiado a 'Task' para que incluya el 'id'
  const docRef = doc(this._collection, task.id); // Aquí utilizamos el id del task para obtener el docRef
  return deleteDoc(docRef); // Asegúrate de retornar la promesa para manejarla correctamente
}

 create(task:TaskCreate){

  return addDoc(this._collection,{...task,userId:this._authState.currentUser?.uid,})
 }


}
