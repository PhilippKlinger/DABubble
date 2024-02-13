import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from './user.service';

const publicRoutes = ['imprint', 'privacy-policy'];

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (publicRoutes.includes(state.url.replace('/', ''))) {
    return true;
  }

  if (userService.currentUser$) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
