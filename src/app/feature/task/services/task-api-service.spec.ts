import { TestBed } from '@angular/core/testing';

import { TaskApiService } from './task-api-service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';
import { TaskDashboardResponse } from '../models/task-dashboard-response-model';
import { TasksResponseModel } from '../models/tasks-response-model';
import { TaskModel } from '../models/task-model';
import { TaskCreateModel } from '../models/task-create-model';
import { TaskCreateResponse } from '../models/task-create-response-model';

//TESTS
describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener el dashboard de tareas correctamente', () => {

    service.getTaskDashboard().subscribe(response => {
      expect(response).toEqual(mockDashboardResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/task/dashboard`);

    expect(req.request.method).toBe('GET');

    req.flush(mockDashboardResponse);
  });

  it('debe obtener la lista de tareas', () => {

    service.getTasks({}).subscribe(response => {
      expect(response).toEqual(mockTasksResponse);
    });

    const req = httpMock.expectOne(
      request => request.url === `${environment.baseUrl}/task`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('');
    expect(req.request.params.get('pageNumber')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('5');

    req.flush(mockTasksResponse);
  });

  it('debe crear una tarea correctamente', () => {
    const createModel: TaskCreateModel = {
      title: 'Nueva tarea',
      description: 'Descripción de prueba'
    };

    service.createTask(createModel).subscribe(response => {
      expect(response).toEqual(mockTaskCreateResponse);
    });

    const req = httpMock.expectOne(
      r => r.url === `${environment.baseUrl}/task`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createModel);

    req.flush(mockTaskCreateResponse);

  });
});

//MOCKS
const mockDashboardResponse: TaskDashboardResponse = {
  total: 10,
  completed: 6,
  pending: 4
};

const mockExptectedTasks: TaskModel[] = [
  {
    id: 1,
    title: 'Tarea 1',
    description: 'Descripción de la tarea 1',
    status: 'pendiente',
    createAt: '10 de December, 2025, Hora: 11:47:1',
  },
  {
    id: 2,
    title: 'Tarea 2',
    description: 'Descripción de la tarea 2',
    status: 'completada',
    createAt: '11 de December, 2025, Hora: 09:30:0',
  },
]

const mockTasksResponse: TasksResponseModel = {
  tasks: mockExptectedTasks,
  totalCount: 10,
  pageSize: 5,
}

const mockTaskCreateResponse: TaskCreateResponse = {
  taskId: 1
};



