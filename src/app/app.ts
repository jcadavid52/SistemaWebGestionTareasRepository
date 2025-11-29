import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from './feature/auth/services/auth-api-service';
import { Prueba } from "./prueba/prueba";
import { MasterLayout } from "./core/layouts/master-layout";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Prueba, MasterLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-tareas-web');
  authApiService = inject(AuthApiService);
}
