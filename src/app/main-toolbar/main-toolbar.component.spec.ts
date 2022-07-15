import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
  let isAuthenticated = new ReplaySubject<boolean>();
  let loggedIn = new ReplaySubject<void>();
  let mockAuthService = {
    isAuthenticated$: isAuthenticated.asObservable(),
    login: () => loggedIn.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainToolbarComponent],
      imports: [MatIconModule, MatMenuModule, MatToolbarModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logoutRequested', () => {
    it('should cause the logout output to emit', () => {
      spyOn(component.logout, 'emit');
      component.logoutRequested();
      expect(component.logout.emit).toHaveBeenCalled();
    });
  });

  describe('aboutRequested', () => {
    it('should cause the about output to emit', () => {
      spyOn(component.about, 'emit');
      component.aboutRequested();
      expect(component.about.emit).toHaveBeenCalled();
    });
  });
});
