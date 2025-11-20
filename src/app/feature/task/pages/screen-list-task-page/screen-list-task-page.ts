import { Component, inject, signal, EventEmitter } from '@angular/core';
import { ListTaskComponent } from "../../components/list-task-component/list-task-component";
import { FormAddTaskComponent } from "../../components/form-add-task-component/form-add-task-component";
import { TaskApiService } from '../../services/task-api-service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { TasksResponseModel } from '../../models/tasks-response-model';
import { PaginatorComponent } from "../../../../core/components/paginator-component/paginator-component";

@Component({
  selector: 'app-screen-list-task-page',
  imports: [ListTaskComponent, FormAddTaskComponent, PaginatorComponent],
  templateUrl: './screen-list-task-page.html',
  styleUrl: './screen-list-task-page.css',
})
export class ScreenListTaskPage {
  status = signal('');
  pageNumber = signal(1);
  taskApiService = inject(TaskApiService);
  totalFilterCountTask = this.taskApiService.totalFilterCounts;
  totalCountTask = this.taskApiService.totalCounts;


  tasksQuery = injectQuery<TasksResponseModel>(() => ({
    queryKey: [
      'tasks',
      this.status(),
      this.pageNumber()
    ],
    queryFn: () =>
      firstValueFrom(
        this.taskApiService.getTasks({
          pageNumber: this.pageNumber(),
          status: this.status(),
        })
      )
  }));

  onStatusChange(event: Event) {
    this.pageNumber.set(1);
    const selectElement = event.target as HTMLSelectElement;
    this.status.set(selectElement.value)
  }

  onPageChange(page: number) {
  this.pageNumber.set(page);
}
}
