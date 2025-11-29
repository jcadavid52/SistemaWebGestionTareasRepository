import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../feature/auth/services/auth-api-service';
import { TaskApiService } from '../../feature/task/services/task-api-service';
import { useTaskDashboardQuery } from '../../feature/task/hooks/dashboard-query-task-hook';


@Component({
  selector: 'app-master-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './master-layout.html',
  styleUrl: './master-layout.css',
})
export class MasterLayout {
  authApiService = inject(AuthApiService);
  taskApiService = inject(TaskApiService);
  router = inject(Router);
  user = this.authApiService.user
  dashboard = useTaskDashboardQuery();
  totalCountTask = computed(() => this.dashboard.data()?.total);

  isMenuOpen = signal(false);


  closeSession() {
    this.authApiService.logout();
    this.router.navigate(['auth/login']);
  }

  toggleMenu(){
    this.isMenuOpen.set(!this.isMenuOpen())
  }
  
}
