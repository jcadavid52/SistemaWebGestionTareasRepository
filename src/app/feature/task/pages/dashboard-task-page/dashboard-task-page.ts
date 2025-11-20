import { Component, computed, inject } from '@angular/core';
import { AuthApiService } from '../../../auth/services/auth-api-service';
import { TaskDashboardResponse } from '../../models/task-dashboard-response-model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { TaskApiService } from '../../services/task-api-service';

@Component({
  selector: 'app-dashboard-task-page',
  imports: [],
  templateUrl: './dashboard-task-page.html',
  styleUrl: './dashboard-task-page.css',
})
export class DashboardTaskPage {
  authApiService = inject(AuthApiService);
  taskApiService = inject(TaskApiService);

  totalCounts = this.taskApiService.totalCounts;
  pending = this.taskApiService.pending;
  completed = this.taskApiService.completed;
  user = this.authApiService.user;

  tasksQuery = injectQuery<TaskDashboardResponse>(() => ({
    queryKey: [
      'tasks-dashboard',
    ],
    queryFn: () =>
      firstValueFrom(
        this.taskApiService.getTaskDashboard()
      )
  }));
}
