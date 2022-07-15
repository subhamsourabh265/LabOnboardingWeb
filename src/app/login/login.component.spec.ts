import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
// import { MockComponent } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
// import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { LoginComponent } from './login.component';

let isAuthenticated = new ReplaySubject<boolean>();
let loggedIn = new ReplaySubject<void>();

let mockAuthService = {
  isAuthenticated$: isAuthenticated.asObservable(),
  login: () => loggedIn.asObservable(),
  forgotPassword: () => Promise.resolve(true),
};
let mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
let mockActivatedRoute = {
  snapshot: { queryParams: [] as string[] },
};

mockActivatedRoute.snapshot.queryParams = ['test'];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        // MockComponent(SpinnerComponent)
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call router if there is no change in authentication', fakeAsync(() => {
    mockRouter.navigateByUrl.calls.reset();
    tick();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  }));

  it('should navigate away if user authenticates', fakeAsync(() => {
    mockRouter.navigateByUrl.calls.reset();
    isAuthenticated.next(true);
    tick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
  }));

  describe('onSubmit', () => {
    const simpleForm: NgForm = {} as unknown as NgForm;

    it('should not attempt to log in if the event is undefined', () => {
      spyOn(mockAuthService, 'login');
      component.onSubmit(simpleForm);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
    it('should take the user home when the user logs in', fakeAsync(() => {
      mockRouter.navigateByUrl.calls.reset();
      component.onSubmit(simpleForm, {
        submitter: { id: 'loginButton' },
      } as unknown as SubmitEvent);
      loggedIn.next();
      tick();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
    }));
    it('should set the login to valid when the user logs in', fakeAsync(() => {
      component.onSubmit(simpleForm, {
        submitter: { id: 'loginButton' },
      } as unknown as SubmitEvent);
      loggedIn.next();
      tick();
      expect(component.loginValid).toBeTrue();
    }));
    it('should set the login to not valid when the user logs out', fakeAsync(() => {
      spyOn(console, 'error'); // to suppress error message
      component.onSubmit(simpleForm, {
        submitter: { id: 'loginButton' },
      } as unknown as SubmitEvent);
      loggedIn.error('test');
      tick();
      loggedIn = new ReplaySubject<void>();
      expect(component.loginValid).toBeFalse();
    }));
    it('should start the forgot password flow if the user clicks the forgot password button', fakeAsync(() => {
      const testForm = {
        resetForm: () => {},
      };
      spyOn(mockAuthService, 'forgotPassword').and.returnValue(
        Promise.resolve(true)
      );
      component.onSubmit(
        testForm as NgForm,
        {
          submitter: { id: 'forgotPasswordButton' },
        } as unknown as SubmitEvent
      );
      tick();
      expect(mockAuthService.forgotPassword).toHaveBeenCalled();
    }));
    it('should log the error if the forgot password flow fails', fakeAsync(() => {
      spyOn(mockAuthService, 'forgotPassword').and.returnValue(
        Promise.reject('test')
      );
      spyOn(console, 'error');
      component.onSubmit(simpleForm, {
        submitter: { id: 'forgotPasswordButton' },
      } as unknown as SubmitEvent);
      tick();
      /* eslint-disable no-console */
      expect(console.error).toHaveBeenCalledWith('test');
    }));
  });
});
