import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthApiService } from '../../feature/auth/services/auth-api-service';
import { inject } from "@angular/core";
import { StorageService } from '../../feature/auth/services/storage-service';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from "rxjs";

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authApi = inject(AuthApiService);
    const storage = inject(StorageService);

    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
        return next(req);
    }

    const accessToken = storage.getAccessToken();

    let authReq = req;

    if (accessToken) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` }
        });
    }
    return next(authReq).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            return handle401Error(authReq, next, storage, authApi);
        }

        return throwError(() => error);
    }))
};

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, authToken: StorageService, authApi: AuthApiService) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshSubject.next(null);
        return authApi.refreshToken().pipe(
            switchMap(success => {
                isRefreshing = false;

                if (!success) {
                    return throwError(() => new Error('No se pudo refrescar el token'));
                }

                const newToken = authToken.getAccessToken();
                refreshSubject.next(newToken);

                return next(
                    req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` }
                    })
                );
            }),
            finalize(() => {
                isRefreshing = false;
            }),
            catchError(err => {
                isRefreshing = false;
                authApi.logout();
                return throwError(() => err);
            })
        );
    }

    return refreshSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
            return next(
                req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                })
            );
        })
    );
}