import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {
  constructor(private auth: AuthenticationService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const currentUser = this.auth.currentUserValue;
    if (currentUser !== null) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < expectedRole.length ; i++) {
        if (currentUser.role === expectedRole[i]) {
        //   this.router.navigate(['login']);
          return true;
        }
      }
    }
    return false;
  }
}
