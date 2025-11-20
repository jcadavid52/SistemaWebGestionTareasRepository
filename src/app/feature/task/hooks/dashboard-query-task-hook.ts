import { inject } from "@angular/core";
import { TaskDashboardResponse } from "../models/task-dashboard-response-model";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { firstValueFrom } from "rxjs";
import { TaskApiService } from "../services/task-api-service";

export function useTaskDashboardQuery() {
  const taskApiService = inject(TaskApiService);

  return injectQuery<TaskDashboardResponse>(() => ({
    queryKey: ['tasks-dashboard'],
    queryFn: () =>
      firstValueFrom(taskApiService.getTaskDashboard()),
    staleTime: 1000 * 60 * 5,
  }));
}