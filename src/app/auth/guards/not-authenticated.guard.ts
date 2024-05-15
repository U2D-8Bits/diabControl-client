import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../enums/auth-status.enum';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject( AuthService );
  const router = inject( Router );

  if (authService.authStatus() === AuthStatus.authenticated) {
    router.navigateByUrl('/main')
    return false;
  }


  return true;
};
