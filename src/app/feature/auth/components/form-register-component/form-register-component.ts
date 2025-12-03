import { Component, inject, signal } from '@angular/core';
import { AuthApiService } from '../../services/auth-api-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from '../../models/register-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-register-component',
  imports: [ReactiveFormsModule],
  templateUrl: './form-register-component.html',
  styleUrl: './form-register-component.css',
})
export class FormRegisterComponent {

  authApiService = inject(AuthApiService);
  notificationService = inject(NotificationService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  submitted = signal(false);

  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator
  });

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authApiService.register(this.registerForm.value as RegisterModel).subscribe({
        next: (registered) => {
          if (registered) {
            this.notificationService.showSuccessNotification("Registro exitoso.");
            this.router.navigate(['task/dashboard']);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            {
              this.notificationService.showErrorNotification("Revise los datos ingresados.");
            }
          }else if(error.status === 409){
            this.notificationService.showErrorNotification("El correo electrónico ya está en uso.");
          }
        }
      })
    }
    return;
  }

}
