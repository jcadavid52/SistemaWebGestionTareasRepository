import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTaskPage } from './dashboard-task-page';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { UserModel } from '../../../auth/models/user-model';
import { AuthApiService } from '../../../auth/services/auth-api-service';
import { computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { TaskApiService } from '../../services/task-api-service';

//TESTS
describe('DashboardTaskPage', () => {
  let component: DashboardTaskPage;
  let fixture: ComponentFixture<DashboardTaskPage>;
  let compiled: HTMLElement;
  let queryClient: QueryClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTaskPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideQueryClient(new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
              gcTime: Infinity,
            }
          }
        })),
        { provide: AuthApiService, useClass: MockAuthApiService },
        { provide: TaskApiService, useClass: MockTaskApiService }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardTaskPage);
    component = fixture.componentInstance;

    queryClient = TestBed.inject(QueryClient);

     queryClient.setQueryData(['tasks-dashboard'], {
      totalCounts: 10,
      completed: 5,
      pending: 5
    });

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('debe coincidir el texto del nombre de usuario, con el nombre de usuario de la sesión', () => {
    const p = compiled.querySelector('.user-name') as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.textContent?.trim()).toBe('Bienvenido de nuevo, Juan Pérez!');
  });

   it('el total de tareas debe ser igual a 10', () => {
    const p = compiled.querySelector('.total-task') as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.textContent?.trim()).toBe('10');
  });

  it('el total de tareas completadas debe ser igual a 5', () => {
    const p = compiled.querySelector('.total-completed') as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.textContent?.trim()).toBe('5');
  });

  it('el total de tareas pendientes debe ser igual a 5', () => {
    const p = compiled.querySelector('.total-pending') as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.textContent?.trim()).toBe('5');
  });
});

//MOCKS
export class MockAuthApiService {
  private _user = signal({ id: '1', email: 'user@example.com', fullName: 'Juan Pérez', } as UserModel);
  user = computed(() => this._user());
}

class MockTaskApiService {
  totalCounts = signal(10);
  pending = signal(5);
  completed = signal(5);

  getTaskDashboard() {
    return of({
      total: 10,
      completed: 5,
      pending: 5
    });
  }
}
