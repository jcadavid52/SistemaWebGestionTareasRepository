import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  snackBar = inject(MatSnackBar);
  showSuccessNotification(message: string) {
    this.snackBar.open(
      message,
      'Cerrar',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],

      }
    );
  }

  showErrorNotification(message: string) {
    this.snackBar.open(
      message,
      'Cerrar',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],

      }
    );
  }
}
