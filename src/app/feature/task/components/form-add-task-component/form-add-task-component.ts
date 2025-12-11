import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TaskApiService } from '../../services/task-api-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskCreateModel } from '../../models/task-create-model';
import { HttpErrorResponse } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-form-add-task-component',
  imports: [ReactiveFormsModule],
  templateUrl: './form-add-task-component.html',
  styleUrl: './form-add-task-component.css',
})
export class FormAddTaskComponent {

  @Output() taskAdded = new EventEmitter<void>();

  queryClient = inject(QueryClient);
  taskApiService = inject(TaskApiService);
  notificationService = inject(NotificationService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })

  submitted = signal(false);

  onSubmit() {
    this.submitted.set(true);
    if (this.taskForm.valid) {
      this.taskApiService.createTask(this.taskForm.value as TaskCreateModel).subscribe({
        next: ((resp) => {
          this.notificationService.showSuccessNotification("Tarea registrada con exito");
          this.queryClient.invalidateQueries({
            queryKey: ['tasks']
          });
          this.queryClient.invalidateQueries({ queryKey: ['tasks-dashboard'] });
          this.taskAdded.emit();
        }),
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.notificationService.showErrorNotification("Error: Revise los datos ingresados");
          }
        }
      })

      this.taskForm.reset({
        title: '',
        description: '',
      });
      this.submitted.set(false);
    }
    return;
  }
}
