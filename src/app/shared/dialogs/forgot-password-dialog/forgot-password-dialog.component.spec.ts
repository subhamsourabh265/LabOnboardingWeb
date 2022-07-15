import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../services/auth/auth.service';
import { CognitoService } from '../../../services/cognito/cognito.service';
import {
  ForgotPasswordDialogComponent,
  ForgotPasswordDialogData,
} from './forgot-password-dialog.component';

let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<AuthService, any>> =
  jasmine.createSpyObj('MatDialogRef', ['close']);

let mockCognitoService: jasmine.SpyObj<CognitoService> = jasmine.createSpyObj(
  'CognitoService',
  ['requestForgottenPasswordVerificationCode']
);

describe('ForgotPasswordDialogComponent', () => {
  let component: ForgotPasswordDialogComponent;
  let fixture: ComponentFixture<ForgotPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordDialogComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: CognitoService, useValue: mockCognitoService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should close the dialog', () => {
      mockMatDialogRef.close.calls.reset();
      component.onSubmit();
      expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('enableCodeRequest', () => {
    it('should return false if data is undefined', () => {
      component.data = undefined as unknown as ForgotPasswordDialogData;
      expect(component.enableCodeRequest()).toBeFalse();
    });
    it('should return false if data has no defined components', () => {
      component.data = {} as unknown as ForgotPasswordDialogData;
      expect(component.enableCodeRequest()).toBeFalse();
    });
    it('should return false if data has a username of length 0', () => {
      component.data = { username: '' } as unknown as ForgotPasswordDialogData;
      expect(component.enableCodeRequest()).toBeFalse();
    });
    it('should return false if data does not contain an at-sign', () => {
      component.data = {
        username: 'not an email address',
      } as unknown as ForgotPasswordDialogData;
      expect(component.enableCodeRequest()).toBeFalse();
    });
    it('should return true if given an email address', () => {
      component.data = {
        username: 'example@example.com',
      } as unknown as ForgotPasswordDialogData;
      expect(component.enableCodeRequest()).toBeTrue();
    });
  });

  describe('requestVerificationCode', () => {
    it('should request Cognito send a verification code', () => {
      mockCognitoService.requestForgottenPasswordVerificationCode.and.returnValue(
        Promise.resolve(true)
      );
      component.requestVerificationCode();
      expect(
        mockCognitoService.requestForgottenPasswordVerificationCode
      ).toHaveBeenCalled();
    });
    it('should log the error if Cognito throws an error', fakeAsync(() => {
      mockCognitoService.requestForgottenPasswordVerificationCode.and.returnValue(
        Promise.reject('test error')
      );
      spyOn(console, 'error');
      component.requestVerificationCode();
      tick();
      /* eslint-disable no-console */
      expect(console.error).toHaveBeenCalledWith(
        'Error when trying to send verification code',
        'test error'
      );
    }));
  });
});
