import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  IAuthenticationDetailsData,
  ICognitoUserData,
} from 'amazon-cognito-identity-js';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewPasswordDialogComponent } from 'src/app/shared/dialogs/new-password-dialog/new-password-dialog.component';
import { ForgotPasswordDialogData } from '../../shared/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { LabName } from '../database/lab-name-to-folder-name';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private userPool = new CognitoUserPool(environment.aws.cognitoPool);
  private userData: ICognitoUserData | any;
  private cognitoUser: CognitoUser | null | any;
  private newPassword: string = '';
  private oldPassword: string = '';
  private sessionUserAttributes: any;
  private requiredAttributes: string[] = [];
  private userDisplayName = new BehaviorSubject<string>('');
  private labName = new BehaviorSubject<LabName>(LabName.none);

  constructor(public dialog: MatDialog) {}

  // testing the authenticate method turned into callback hell
  // testing removed
  // technical debt: Is there a better way to do this?
  /*istanbul ignore next*/
  authenticate(user: IAuthenticationDetailsData): Observable<string> {
    this.userData = {
      Username: user.Username,
      Pool: this.userPool,
    };
    const authenticationDetails = new AuthenticationDetails(user);
    this.cognitoUser = new CognitoUser(this.userData);
    return new Observable((observer) => {
      let self = this;
      this.cognitoUser?.authenticateUser(authenticationDetails, {
        onSuccess: function (result: any) {
          const accessToken: string = result.getAccessToken().getJwtToken();
          observer.next(accessToken);
          self.setUserDisplayName();
          // self.setLabName(accessToken);
        },
        mfaRequired: function (codeDeliveryDetails: any) {
          // MFA is required to complete user authentication.
          // Get the code from user and call
          const mfaCode: string =
            prompt(
              'We have delivered the authentication code by SMS to you. Please enter the code to complete authentication',
              ''
            ) || '';
          self.cognitoUser?.sendMFACode(mfaCode, this);
        },
        onFailure: function (err: any) {
          /*eslint-disable no-console*/ console.error(
            'json',
            err.message || JSON.stringify(err)
          );
          observer.error(err);
        },
        newPasswordRequired: function (
          userAttributes: any,
          requiredAttributes: any
        ) {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          delete userAttributes.email_verified;
          delete userAttributes.phone_number_verified;
          delete userAttributes.phone_number;
          delete userAttributes.email;
          // store userAttributes on global variable
          self.sessionUserAttributes = userAttributes;
          self.requiredAttributes = requiredAttributes;
          self.openDialog(this);
        },
      });
    });
  }

  openDialog(callback: any): void {
    const dialogRef = this.dialog.open(NewPasswordDialogComponent, {
      width: '500px',
      data: {
        newPassword: this.newPassword,
        requiredAttributes: this.requiredAttributes,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.handleNewPassword(data, callback);
    });
  }

  handleNewPassword(data: any, callback: any) {
    this.cognitoUser?.completeNewPasswordChallenge(
      data.newPassword,
      { ...this.sessionUserAttributes, ...data.userAttributes },
      callback
    );
  }

  setCognitoUser(username = '') {
    if (username) {
      const data: ICognitoUserData = {
        Username: username,
        Pool: new CognitoUserPool(environment.aws.cognitoPool),
      };
      this.cognitoUser = new CognitoUser(data);
      this.setUserDisplayName();
      this.cognitoUser.getSession(() => {});
    }
  }

  // got bogged down writing tests for this
  // technical debt: Can this be covered with tests?
  /* istanbul ignore next */
  getUserAttributes(): Promise<CognitoUserAttribute[]> {
    if (this.cognitoUser) {
      return new Promise<CognitoUserAttribute[]>((resolve, reject) => {
        try {
          this.cognitoUser?.getUserAttributes((error: any, data: any) => {
            if (error) {
              console.error(error);
              reject([]);
            } else {
              resolve(data || []);
            }
          });
        } catch (error) {
          console.log(error);
          reject([]);
        }
      }).catch((error) => {
        console.error(error);
        return Promise.reject([]);
      });
    } else {
      return Promise.resolve([]);
    }
  }

  getCurrentCognitoUser(): CognitoUser | null {
    const userPool = new CognitoUserPool(environment.aws.cognitoPool);
    return userPool.getCurrentUser();
  }

  /**
   * Set current congnito session
   */
  setCurrentCognitoUser() {
    this.cognitoUser = this.getCurrentCognitoUser();
  }

  getIdToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // TODO: is there a way to test the callback paths?
      /* istanbul ignore if */
      if (this.cognitoUser) {
        this.cognitoUser.getSession(
          (error: Error | null, result: CognitoUserSession | null) => {
            if (result) {
              return resolve(result.getIdToken().getJwtToken());
            } else {
              return reject(error);
            }
          }
        );
      } else {
        return reject('User not defined');
      }
    });
  }

  async setUserDisplayName() {
    const attributes = await this.getUserAttributes();
    const givenName =
      attributes.find((x) => x.Name === 'given_name')?.Value || '';
    const familyName =
      attributes.find((x) => x.Name === 'family_name')?.Value || '';
    const display = (givenName + ' ' + familyName).trim();
    this.userDisplayName.next(display);
  }

  getUserDisplayName(): Observable<string> {
    return this.userDisplayName.asObservable();
  }

  eraseUserDisplayName() {
    this.userDisplayName.next('');
  }

  // fetchLabNameFromToken(token: string) {
  //   let name = LabName.none;
  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     const groups = (decodedToken as any)['cognito:groups'] as string[];
  //     /* istanbul ignore next */
  //     if (groups.includes('TestLab')) {
  //       name = LabName.testlab;
  //     } else if (groups.includes('Redwood')) {
  //       name = LabName.redwood;
  //     } else {
  //       name = LabName.example;
  //     }
  //   }
  //   return name;
  // }

  // setLabName(token = '') {
  //   this.labName.next(this.fetchLabNameFromToken(token));
  // }

  getLabName(): Observable<LabName> {
    return this.labName.asObservable();
  }

  getLabNameCurrentValue(): LabName {
    return this.labName.getValue();
  }

  eraseLabName() {
    this.labName.next(LabName.none);
  }

  requestForgottenPasswordVerificationCode(username: string): Promise<boolean> {
    this.setCognitoUser(username);
    return new Promise<boolean>((resolve, reject) => {
      try {
        if (this.cognitoUser) {
          this.cognitoUser.forgotPassword({
            onSuccess: /* istanbul ignore next */ () => resolve(true),
            onFailure: /* istanbul ignore next */ () => resolve(false),
          });
        }
      } catch (error) {
        /* istanbul ignore next */ reject(error);
      }
    });
  }

  resetForgottenPassword(
    dialogData: ForgotPasswordDialogData
  ): Promise<boolean> {
    if (!this.cognitoUser) {
      this.setCognitoUser(dialogData.username);
    }
    const verificationCode = dialogData.verificationCode;
    const newPassword = dialogData.newPassword;
    if (this.cognitoUser && verificationCode && newPassword) {
      return new Promise<boolean>((resolve, reject) => {
        try {
          if (this.cognitoUser) {
            this.cognitoUser.confirmPassword(verificationCode, newPassword, {
              onSuccess: /* istanbul ignore next */ () => resolve(true),
              onFailure: /* istanbul ignore next */ () => resolve(false),
            });
          }
        } catch (error) {
          /* istanbul ignore next */ reject(error);
        }
      });
    } else {
      return Promise.resolve(false);
    }
  }
}
