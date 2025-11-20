import { Component, inject, Input, signal } from '@angular/core';
import { TaskModel } from '../../models/task-model';
import { RouterLink } from "@angular/router";
import { TaskApiService } from '../../services/task-api-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { HttpErrorResponse } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { TaskUpdateModel } from '../../models/task-update-model';

@Component({
  selector: 'app-task-component',
  imports: [RouterLink],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  @Input() task: Partial<TaskModel> = {};
  taskApiService = inject(TaskApiService);
  notificationService = inject(NotificationService);
  queryClient = inject(QueryClient);

  status = signal('');

  deleteTask(id?: number) {
    this.taskApiService.deleteTask(id).subscribe(
      {
        next: () => {
          this.notificationService.showSuccessNotification("Eliminado con éxito!");
          this.queryClient.invalidateQueries({
            queryKey: ['tasks']
          });
          this.queryClient.invalidateQueries({ queryKey: ['tasks-dashboard'] });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.notificationService.showErrorNotification("Error: no se encontró recurso, intente más tarde");
          }
        }
      }
    )
  }

  onChecke(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.status.update(value => 'Completado')
      this.updateStatusTask('Completado');
    } else {
      this.status.update(value => 'Pendiente')
      this.updateStatusTask('Pendiente');
    }
  }

  updateStatusTask(status: string) {
    const updateModel: TaskUpdateModel = {
      status
    };
    
    this.taskApiService.updateTask(updateModel, this.task.id).subscribe(
      {
        next: () => {
          this.notificationService.showSuccessNotification("Se modificó a estado: " + this.status());
          this.queryClient.invalidateQueries({
            queryKey: ['tasks']
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.notificationService.showErrorNotification("Error: no se encontró recurso, intente más tarde");
          }
        }
      }
    )
  }
}
