import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksResponseModel } from '../../models/tasks-response-model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TaskApiService } from '../../services/task-api-service';
import { firstValueFrom } from 'rxjs';
import { TaskResponseModel } from '../../models/task-response-model';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TaskModel } from '../../models/task-model';
import { NotificationService } from '../../../../core/services/notification-service';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskUpdateModel } from '../../models/task-update-model';

@Component({
  selector: 'app-detail-task-page',
  imports: [ReactiveFormsModule],
  templateUrl: './detail-task-page.html',
  styleUrl: './detail-task-page.css',
})
export class DetailTaskPage {
  route = inject(ActivatedRoute);
  taskApiService = inject(TaskApiService);
  formBuilder = inject(FormBuilder);
  notificationService = inject(NotificationService);

  idTask = signal<number>(0);
  taskSignal = signal<TaskModel | null>(null);
  submitted = signal(false);

  constructor() {
    const state = history.state;
    const id = state?.id;

    if (id) {
      this.idTask.update(() => id);
      this.tasksQuery.refetch();
    }

    effect(() => {
      const data = this.tasksQuery.data();
      if (data) {
        this.taskSignal.set(data.task);
        this.taskEditForm.patchValue({
          id: data.task.id,
          title: data.task.title,
          description: data.task.description
        });
      }
    });

  }

  tasksQuery = injectQuery<TaskResponseModel>(() => ({
    queryKey: [
      'task-byId',
      this.idTask()
    ],
    queryFn: () =>
      firstValueFrom(
        this.taskApiService.getTaskById(this.idTask())
      ),
    enabled: this.idTask() > 0,
  }));

  taskEditForm = this.formBuilder.group({
    id: [0],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })

  onSubmit() {
    this.submitted.set(true);
    if (this.taskEditForm.valid) {
      console.log(this.taskEditForm.value);
      this.taskApiService.updateTask(this.taskEditForm.value as TaskUpdateModel, this.taskEditForm.value.id ?? undefined).subscribe(
        {
          next: () => {
            this.notificationService.showSuccessNotification("Modificación exitosa");
            this.tasksQuery.refetch();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.notificationService.showErrorNotification("Error: no se encontró recurso, intente más tarde");
            }
          }
        }
      )
    }
    return;
  }
}
