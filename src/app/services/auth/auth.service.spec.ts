import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CognitoService } from '../cognito/cognito.service';
import { AuthService } from './auth.service';

global.Buffer = global.Buffer || require('buffer').Buffer;

let mockRouter = jasmine.createSpyObj('Router', ['navigate']);
let mockCognitoService = jasmine.createSpyObj('CognitoService', [
  'authenticate',
  'resetForgottenPassword',
  'eraseUserDisplayName',
  'eraseLabName',
  'setCurrentCognitoUser',
  // 'setLabName',
]);
let mockMatDialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj(
  'MatDialog',
  ['open']
);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CognitoService, useValue: mockCognitoService },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start isAuthenticated with value false', fakeAsync(() => {
    let authenticated = true;
    const subscription = service.isAuthenticated$.subscribe(
      (val) => (authenticated = val)
    );
    expect(authenticated).toBeFalse();
    subscription.unsubscribe();
  }));

  describe('ngOnDestroy', () => {
    it('should complete the authSub observable', fakeAsync(() => {
      let hasCompleted = false;
      const subscription = service['_authSub$'].subscribe(
        () => {},
        () => {},
        () => {
          hasCompleted = true;
        }
      );
      service.ngOnDestroy();
      tick();
      expect(hasCompleted).toBeTrue();
      subscription.unsubscribe();
    }));
  });

  describe('check for local token', () => {
    it('should not change authSub if there is no local token', fakeAsync(() => {
      let emittedNum = 0;
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      const subscription = service['_authSub$'].subscribe(
        () => (emittedNum += 1)
      );
      service.checkForLocalToken();
      tick();
      expect(emittedNum).toBeLessThan(2);
      subscription.unsubscribe();
    }));
    it('should change authSub if there is a local token', fakeAsync(() => {
      let emittedNum = 0;
      const token = '.' + 'eyJtZXNzYWdlIjoidGVzdCJ9';
      spyOn(window.localStorage, 'getItem').and.returnValue(token); // base64 for {"message": "test"}
      const subscription = service['_authSub$'].subscribe(
        () => (emittedNum += 1)
      );
      service.checkForLocalToken();
      tick();
      expect(emittedNum).toBe(2);
      expect(mockCognitoService.setCurrentCognitoUser).toHaveBeenCalled();
      // expect(mockCognitoService.setLabName).toHaveBeenCalledWith(token);
      subscription.unsubscribe();
    }));
  });

  describe('login', () => {
    it('should return an observable that stores a new token in local storage', fakeAsync(() => {
      spyOn(localStorage, 'setItem');
      mockCognitoService.authenticate.and.returnValue(of('token'));
      const obs = service.login('test', 'test');
      const subscription = obs.subscribe(() => {});
      tick();
      expect(localStorage.setItem).toHaveBeenCalled();
      subscription.unsubscribe();
    }));
  });

  describe('logout', () => {
    it('should navigate the user to a redirect url', () => {
      mockRouter.navigate.calls.reset();
      service.logout('test');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test']);
    });
  });

  describe('forgotPassword', () => {
    it('should open a dialog', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({}),
        close: null,
      });
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      service.forgotPassword();
      tick();
      expect(mockMatDialog.open).toHaveBeenCalled();
    }));
    it('should invoke the resetForgottenPassword method', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({}),
        close: null,
      });
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      service.forgotPassword();
      tick();
      expect(mockCognitoService.resetForgottenPassword).toHaveBeenCalled();
    }));
    it('should gracefully handle an undefined response from the dialog', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of(undefined),
        close: null,
      });
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      service.forgotPassword();
      tick();
      expect(mockCognitoService.resetForgottenPassword).toHaveBeenCalled();
    }));
  });
});
