import { Component, inject, signal, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ListTaskComponent } from "../../components/list-task-component/list-task-component";
import { FormAddTaskComponent } from "../../components/form-add-task-component/form-add-task-component";
import { TaskApiService } from '../../services/task-api-service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { TasksResponseModel } from '../../models/tasks-response-model';
import { PaginatorComponent } from "../../../../core/components/paginator-component/paginator-component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-screen-list-task-page',
  imports: [ListTaskComponent, FormAddTaskComponent, PaginatorComponent, MatDialogModule],
  templateUrl: './screen-list-task-page.html',
  styleUrl: './screen-list-task-page.css',
})
export class ScreenListTaskPage {
  status = signal('');
  pageNumber = signal(1);
  modalAddForm = signal(false);
  taskApiService = inject(TaskApiService);
  dialogModal = inject(MatDialog);
  totalFilterCountTask = this.taskApiService.totalFilterCounts;
  totalCountTask = this.taskApiService.totalCounts;

  @ViewChild('modalAddFormTask') modalAddFormTask!: TemplateRef<any>;


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

  onModal() {
    this.dialogModal.open(this.modalAddFormTask, {
      width: '350px',
    });
  }
}
