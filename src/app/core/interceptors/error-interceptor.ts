import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NotificationService } from "../services/notification-service";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const handledStatuses = [400, 401, 403, 409];
            if (!handledStatuses.includes(error.status)) {
                let errorMessage = 'Ha ocurrido un error inesperado.';
                if (error.error instanceof ErrorEvent) {
                    console.error('Error de red/cliente:', error.error.message);
                    errorMessage = 'Error de conexión: Por favor, revise su red.';
                } else {
                    switch (error.status) {
                        case 0:
                            errorMessage = 'No se pudo conectar con el servidor. El servicio no está disponible.';
                            break;
                        case 500:
                            errorMessage = 'Error interno del servidor. Por favor, contacte a soporte.';
                            break;
                    }
                }
                notificationService.showErrorNotification(errorMessage);
            }
            return throwError(() => error);
        })
    )
}