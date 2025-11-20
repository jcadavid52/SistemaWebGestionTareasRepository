import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthApiService } from "../../feature/auth/services/auth-api-service";

export const noAuthenticatedGuard: CanActivateFn = (route, state) => {
    const {authStatus} = inject(AuthApiService);
    const router = inject(Router);

    if(authStatus() === 'authenticated'){
        router.navigate(['task/dashboard']);
        return false;
    }
    return true;
}