import { Component, input } from '@angular/core';
import { Task } from '../../data-acces/task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table.component.html',
 
})
export class TableComponent {
  tasks = input.required<Task[]>();
} 
