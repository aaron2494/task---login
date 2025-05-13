import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthStateService } from "../shared/data-access/auth-state.service";
import { map } from "rxjs";

const checkAuth = (router: Router, state: any) => {
    if (!state) {
        router.navigateByUrl("/auth/sign-in");
        return false;
    }
    return true;
};

export const privateGuard = (): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const authState = inject(AuthStateService);
        return authState.authState$.pipe(
            map(state => checkAuth(router, state))
        );
    };
};

export const publicGuard = (): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const authState = inject(AuthStateService);

        return authState.authState$.pipe(
            map(state => {
                if (state) {
                    router.navigateByUrl("/task");
                    return false;
                }
                return true;
            })
        );
    };
};