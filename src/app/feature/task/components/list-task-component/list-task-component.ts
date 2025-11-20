import { Component, computed, effect, inject, Input, signal, SimpleChanges } from '@angular/core';
import { TaskComponent } from "../task-component/task-component";
import { TaskModel } from '../../models/task-model';

@Component({
  selector: 'app-list-task-component',
  imports: [TaskComponent],
  templateUrl: './list-task-component.html',
  styleUrl: './list-task-component.css',
})
export class ListTaskComponent {
  @Input({required:true}) taskList: TaskModel[] = [];

}