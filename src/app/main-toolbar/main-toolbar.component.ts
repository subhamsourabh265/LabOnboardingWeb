import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APP_TITLE } from '../app-title';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-lab-onb-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {
  public title = APP_TITLE;
  public isAuthenticated: Observable<boolean> =
    this.authService.isAuthenticated$;
  @Output() logout = new EventEmitter<boolean>();
  @Output() about = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  public logoutRequested() {
    this.logout.emit(true);
  }

  public aboutRequested() {
    this.about.emit(true);
  }
}
