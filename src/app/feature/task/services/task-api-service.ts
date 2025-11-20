import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TasksResponseModel } from '../models/tasks-response-model';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { TaskCreateModel } from '../models/task-create-model';
import { TaskCreateResponse } from '../models/task-create-response-model';
import { TaskDashboardResponse } from '../models/task-dashboard-response-model';
import { AuthTokenService } from '../../auth/services/auth-token-service';
import { TaskUpdateModel } from '../models/task-update-model';
import { TaskResponseModel } from '../models/task-response-model';

const baseUrl = environment.baseUrl;
export const maximunSizePage = 5; 

export interface Params {
  pageSize?: number;
  pageNumber?: number;
  status?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root',
})

export class TaskApiService {

  private httpClient = inject(HttpClient);

  private _totalCounts = signal<number | null>(null);
  private _pending = signal<number | null>(null);
  private _completed = signal<number | null>(null);
  private _totalFilterCounts = signal<number | null>(null);

  totalCounts = computed(() => this._totalCounts());
  pending = computed(() => this._pending());
  completed = computed(() => this._completed());
  totalFilterCounts = computed(() => this._totalFilterCounts());

  getTasks(params: Params): Observable<TasksResponseModel> {

    const pageSize = params.pageSize ?? maximunSizePage;
    const pageNumber = params.pageNumber ?? 1;
    const status = params.status || '';

    return this.httpClient.get<TasksResponseModel>(`${baseUrl}/task`, {

      params: {
        pageSize,
        pageNumber,
        status
      }
    }).pipe(
      tap(resp => {
        this._totalFilterCounts.set(resp.totalCount);
      }),
      catchError(err => throwError(() => err))
    );
  }

  getTaskById(id: number): Observable<TaskResponseModel> {

    return this.httpClient.get<TaskResponseModel>(`${baseUrl}/task/${id}`, {
    });
  }

  getTaskDashboard(): Observable<TaskDashboardResponse> {
    return this.httpClient.get<TaskDashboardResponse>(`${baseUrl}/task/dashboard`).pipe(
      map(resp => {
        this.handleSuccessDashboard(resp);
        return resp;
      }),
      catchError(err => throwError(() => err))
    );
  }

  createTask(createModel: TaskCreateModel): Observable<TaskCreateResponse> {
    return this.httpClient.post<TaskCreateResponse>(`${baseUrl}/task`, createModel);
  }

  updateTask(updateModel: TaskUpdateModel, id?: number): Observable<void> {
    if (!id) {
      throw new Error("Id es requerido para modificar una tarea");
    }
    return this.httpClient.put<void>(`${baseUrl}/task/${id}`, updateModel).pipe(
      catchError(err => throwError(() => err))
    )
  }

  deleteTask(id?: number): Observable<void> {
    if (!id) {
      throw new Error("Id es requerido para eliminar una tarea");
    }
    return this.httpClient.delete<void>(`${baseUrl}/task/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  }

  private handleSuccessDashboard({ total, pending, completed }: TaskDashboardResponse) {
    this._completed.set(completed);
    this._pending.set(pending);
    this._totalCounts.set(total);
  }


}
