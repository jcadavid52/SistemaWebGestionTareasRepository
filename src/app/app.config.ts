import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSweetAlert2 } from "@sweetalert2/ngx-sweetalert2";

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'

import { withDevtools } from '@tanstack/angular-query-experimental/devtools'


export const appConfig: ApplicationConfig = {
  providers: [
    provideSweetAlert2({
            fireOnInit: false,
            dismissOnDestroy: true,
        }),  
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([authInterceptor,errorInterceptor])
    ),
    provideTanStackQuery(new QueryClient(),withDevtools())
  ]
};
