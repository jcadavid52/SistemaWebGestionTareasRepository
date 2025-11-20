import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api-service';
import { LoginModel } from '../../models/login-model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification-service';

import { AuthorizedResponseModel } from '../../models/authorized-response-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './form-login-component.html',
  styleUrl: './form-login-component.css',
})
export class FormLoginComponent {

  authApiService = inject(AuthApiService);
  notificationService = inject(NotificationService);

  formBuilder = inject(FormBuilder);
  router = inject(Router);

  submitted = signal(false);
  showPassword = signal(false);

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  onSubmit() {
    this.submitted.set(true);
    if (this.loginForm.valid) {
      this.authApiService.login(this.loginForm.value as LoginModel).subscribe({
        next: (authenticated) => {
          if (authenticated) {

            this.router.navigate(['task/dashboard']);
          }
        },
        error: (error: HttpErrorResponse) => {
          
          if (error.status === 401) {
            this.notificationService.showErrorNotification("Clave o usuario inválido");
          }
        }
      })
    }

    return;
  }
}
