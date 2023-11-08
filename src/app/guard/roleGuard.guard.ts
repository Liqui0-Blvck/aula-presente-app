import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private sharedService: SharedService) {}

  private rol = ''

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRole = next.data['expectedRole']

    this.sharedService.getUser().subscribe((res) => {
      if (res) {
        this.rol = res.rol
      }
    })

    if (this.rol === expectedRole){
      return true
    } else {
      return false
    }
  }
}

