import { ComponentType } from '@angular/cdk/portal';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  ICognitoUserData,
} from 'amazon-cognito-identity-js';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForgotPasswordDialogData } from '../../shared/dialogs/forgot-password-dialog/forgot-password-dialog.component.js';
import { NewPasswordDialogComponent } from '../../shared/dialogs/new-password-dialog/new-password-dialog.component';
import { LabName } from '../database/lab-name-to-folder-name';
import { CognitoService } from './cognito.service';

describe('CognitoService', () => {
  let service: CognitoService;
  let newPassword = new ReplaySubject<void>();
  let mockMatDialogRef = {
    close: (password: string) => of(),
  };
  let mockMatDialog = {
    open: function (component: ComponentType<NewPasswordDialogComponent>) {
      return this;
    },
    afterClosed: () => newPassword.asObservable(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    });
    service = TestBed.inject(CognitoService);
  });

  beforeEach(() => {
    service['labName'] = new BehaviorSubject<LabName>(LabName.none);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('Should open dialog', () => {
      spyOn(service.dialog, 'open').and.callThrough();
      spyOn(
        service.dialog.open(NewPasswordDialogComponent),
        'afterClosed'
      ).and.callThrough();
      service.openDialog((): any => {});
      expect(service.dialog.open).toHaveBeenCalledWith(
        NewPasswordDialogComponent
      );
    });
  });

  describe('handleNewPassword', () => {
    it('should handle new password flow', fakeAsync(() => {
      spyOn(
        service.dialog.open(NewPasswordDialogComponent),
        'afterClosed'
      ).and.returnValue(of([]));
      spyOn(service, 'handleNewPassword');
      service.openDialog((): any => {});
      tick();
      expect(service.handleNewPassword).toHaveBeenCalled();
    }));
  });

  describe('handleNewPassword', () => {
    it('should call completeNewPasswordChallenge', fakeAsync(() => {
      Object.defineProperty(service, 'cognitoUser', {
        value: {
          completeNewPasswordChallenge: () => of(),
        },
        writable: false,
      });
      const completeNewPasswordChallengeSpy = spyOn(
        service['cognitoUser'],
        'completeNewPasswordChallenge' as never
      ).and.callThrough();
      service.handleNewPassword('Test@123', () => {});
      expect(completeNewPasswordChallengeSpy).toHaveBeenCalled();
    }));

    it('cognitoUser should be null', fakeAsync(() => {
      service['cognitoUser'] = null as unknown as CognitoUser;
      service.handleNewPassword('Test@123', () => {});
      expect(service['cognitoUser']).toBe(null as unknown as CognitoUser);
    }));
  });

  describe('setCognitoUser', () => {
    it('should not modify the user if the username is falsy', () => {
      service['cognitoUser'] = undefined as unknown as CognitoUser;
      spyOn(service, 'setUserDisplayName');
      service.setCognitoUser();
      expect(service['cognitoUser']).toBeUndefined();
    });
    it('should modify the user if the username is truthy', () => {
      service['cognitoUser'] = undefined as unknown as CognitoUser;
      spyOn(service, 'setUserDisplayName');
      service.setCognitoUser('testusername');
      expect(service['cognitoUser']).toBeDefined();
    });
  });

  describe('requestForgottenPasswordVerificationCode', () => {
    it('should request a verification code', fakeAsync(() => {
      const data: ICognitoUserData = {
        Username: 'testname',
        Pool: new CognitoUserPool(environment.aws.cognitoPool),
      };
      service['cognitoUser'] = new CognitoUser(data);
      spyOn(service, 'setCognitoUser');
      spyOn(service['cognitoUser'], 'forgotPassword');
      service.requestForgottenPasswordVerificationCode('testname');
      tick();
      expect(service['cognitoUser'].forgotPassword).toHaveBeenCalled();
    }));
  });

  describe('resetForgottenPassword', () => {
    it('should confirm the new password with Cognito', fakeAsync(() => {
      const data: ICognitoUserData = {
        Username: 'testname',
        Pool: new CognitoUserPool(environment.aws.cognitoPool),
      };
      service['cognitoUser'] = new CognitoUser(data);
      spyOn(service, 'setCognitoUser');
      spyOn(service['cognitoUser'], 'confirmPassword');
      service.resetForgottenPassword({
        verificationCode: '5',
        newPassword: 'pass',
        username: 'user',
      });
      tick();
      expect(service['cognitoUser'].confirmPassword).toHaveBeenCalled();
    }));
    it('should set the Cognito user if there is no user defined', fakeAsync(() => {
      service['cognitoUser'] = undefined as unknown as CognitoUser;
      spyOn(service, 'setCognitoUser');
      service.resetForgottenPassword({} as ForgotPasswordDialogData);
      tick();
      expect(service.setCognitoUser).toHaveBeenCalled();
    }));
  });

  describe('getUserAttributes', () => {
    it('should resolve to an empty array if the user is undefined', fakeAsync(() => {
      service['cognitoUser'] = undefined as unknown as CognitoUser;
      let result = undefined as unknown as CognitoUserAttribute[];
      service.getUserAttributes().then((x) => (result = x));
      tick();
      expect(result).toEqual([]);
    }));
  });

  describe('getCurrentCognitoUser', () => {
    it('should get current cognito user', () => {
      service['cognitoUser'] = null as unknown as CognitoUser | null;
      const userPool = new CognitoUserPool(environment.aws.cognitoPool);
      spyOn(service, 'getCurrentCognitoUser')
        .and.returnValue(userPool.getCurrentUser() as CognitoUser | null)
        .and.callThrough();
      const currentUser = service.getCurrentCognitoUser();
      expect(currentUser).toEqual(userPool.getCurrentUser());
    });
  });

  describe('setCurrentCognitoUser', () => {
    it('should set current cognito user', () => {
      service['cognitoUser'] = null as unknown as CognitoUser | null;
      const userPool = new CognitoUserPool(environment.aws.cognitoPool);
      spyOn(service, 'getCurrentCognitoUser').and.returnValue(
        userPool.getCurrentUser() as CognitoUser | null
      );
      service.setCurrentCognitoUser();
      expect(service.getCurrentCognitoUser).toHaveBeenCalled();
      expect(service['cognitoUser']).toEqual(userPool.getCurrentUser());
    });
  });

  describe('getIdToken', () => {
    it('should reject if user is not defined', async () => {
      service['cognitoUser'] = undefined as unknown as CognitoUser;
      await expectAsync(service.getIdToken()).toBeRejectedWith(
        'User not defined'
      );
    });
    it('should decide based on session information if user is defined', fakeAsync(() => {
      service['cognitoUser'] = {
        getSession: () => {},
      } as unknown as CognitoUser;
      spyOn(service['cognitoUser'], 'getSession');
      service.getIdToken();
      tick();
      expect(service['cognitoUser'].getSession).toHaveBeenCalled();
    }));
  });

  describe('setUserDisplayName', () => {
    it('should create a string with given name and family name', fakeAsync(() => {
      spyOn(service, 'getUserAttributes').and.returnValue(
        Promise.resolve([
          { Name: 'family_name', Value: 'Jones' },
          { Name: 'given_name', Value: 'Tom' },
        ] as unknown as CognitoUserAttribute[])
      );
      spyOn(service['userDisplayName'], 'next');
      service.setUserDisplayName();
      tick();
      expect(service['userDisplayName'].next).toHaveBeenCalledWith('Tom Jones');
    }));
    it('should return the empty string if the values are not defined', fakeAsync(() => {
      spyOn(service, 'getUserAttributes').and.returnValue(
        Promise.resolve([
          { Name: 'family_name' },
          { Name: 'given_name' },
        ] as unknown as CognitoUserAttribute[])
      );
      spyOn(service['userDisplayName'], 'next');
      service.setUserDisplayName();
      tick();
      expect(service['userDisplayName'].next).toHaveBeenCalledWith('');
    }));
    it('should return the empty string if the attributes are not defined', fakeAsync(() => {
      spyOn(service, 'getUserAttributes').and.returnValue(
        Promise.resolve([
          { Name: 'nope' },
          { Name: 'also nope' },
        ] as unknown as CognitoUserAttribute[])
      );
      spyOn(service['userDisplayName'], 'next');
      service.setUserDisplayName();
      tick();
      expect(service['userDisplayName'].next).toHaveBeenCalledWith('');
    }));
  });

  describe('getUserDisplayName', () => {
    it('should return an Observable with empty string as first item emitted', fakeAsync(() => {
      let result = 'initial value';
      const subscription = service
        .getUserDisplayName()
        .subscribe((x) => (result = x));
      tick();
      expect(result).toBe('');
      subscription.unsubscribe();
    }));
  });

  describe('eraseUserDisplayName', () => {
    it('should send the empty string to the user displayname Subject', () => {
      spyOn(service['userDisplayName'], 'next');
      service.eraseUserDisplayName();
      expect(service['userDisplayName'].next).toHaveBeenCalledWith('');
    });
  });

  // describe('setLabName', () => {
  //   // TODO: create a non-redwood token
  //   const redwoodToken =
  //     'eyJraWQiOiJOVng3aWV3Rkd0eEh3a3o3d1drbjN6d1V5NHlsbk1GNW1iZkdLdENOUXZNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTA3MDdiMS0yNmE3LTRmZDQtOGE5Ni1jYjc5MmIxYjYzOTAiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0yXzNjOTI4NjgwLTljMzUtNDljNS1hOTliLWMzZTYwMDhlODgyYyIsImNvZ25pdG86Z3JvdXBzIjpbIlJlZHdvb2QiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfTkFCMHFnVTBrIiwiY2xpZW50X2lkIjoiNmV2dW82MjU1NzE3MWRqZ2k1Mzk2Zzl2MGYiLCJvcmlnaW5fanRpIjoiNGQ1MTZiZDEtMGYyOC00YThkLTg4YjEtNTI2NzdmYzQ0NjQwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY0NjY3MTUzNCwiZXhwIjoxNjQ2NzE0NzMzLCJpYXQiOjE2NDY2NzE1MzQsImp0aSI6IjZjNDJjYmE0LWRiODktNGYyMC05MjgxLThlZTkyY2QyYzY0NyIsInVzZXJuYW1lIjoiY2EwNzA3YjEtMjZhNy00ZmQ0LThhOTYtY2I3OTJiMWI2MzkwIn0.clVw1S-TVWwWs3uChLy5fq0nqkT2knvYFp8g9SimA5b6m0IDqEji4272ZWdg2x1P_qks_qh13CvTDn1CZ4ZpkUWSjQd7vRuEI3acD149uxTb1y-Dffn7Cvh3WC0bQkERTsjemdsWITMd0TH9M6RrvJK8qeP5AqzLnzGq4CgY9kN0VU8lTH0QsC486A-BpF5JBswLwg53EJOrPgbaIvcbczhKfwJH2hbdsSeZUiMpmcAwdG3Uq9IT5LhyHfazW6WSS979M0KiklhnaC93PRdU3yB-cC9K0XOCnGpokrXBJNgqDnZ_oufCtV1QN6L_6IGR_2-3T030lJEjbVpmK_eTNA';

  //   it('should set lab name to empty string if token is not defined', () => {
  //     spyOn(service['labName'], 'next');
  //     service.setLabName();
  //     expect(service['labName'].next).toHaveBeenCalledWith(LabName.none);
  //   });
  //   it('should set lab name to Redwood if token places Redwood in group', () => {
  //     spyOn(service['labName'], 'next');
  //     service.setLabName(redwoodToken);
  //     expect(service['labName'].next).toHaveBeenCalledWith(LabName.redwood);
  //   });
  // });

  describe('getLabName', () => {
    it('should return an Observable with empty string as first item emitted', fakeAsync(() => {
      let result = 'initial value';
      const subscription = service.getLabName().subscribe((x) => (result = x));
      tick();
      expect(result).toBe('');
      subscription.unsubscribe();
    }));
  });

  describe('getLabNameCurrentValue', () => {
    it('should return the current value of the labname behavior subject', () => {
      service['labName'].next('test' as LabName);
      expect(service.getLabNameCurrentValue()).toBe('test');
    });
  });

  describe('eraseLabName', () => {
    it('should set lab name to empty string', () => {
      spyOn(service['labName'], 'next');
      service.eraseLabName();
      expect(service['labName'].next).toHaveBeenCalledWith(LabName.none);
    });
  });
});
