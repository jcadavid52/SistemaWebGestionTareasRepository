import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthApiService } from "../../feature/auth/services/auth-api-service";

export const authenticatedGuard: CanActivateFn = (route, state) => {
    const { authStatus } = inject(AuthApiService);
    const router = inject(Router);

    if (authStatus() === 'authenticated') {
        return true;
    } else {
        router.navigate(['auth/login']);
        return false;
    }
}