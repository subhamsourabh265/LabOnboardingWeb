import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ForgotPasswordDialogComponent,
  ForgotPasswordDialogData,
} from '../../shared/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { CognitoService } from '../cognito/cognito.service';

global.Buffer = global.Buffer || require('buffer').Buffer;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public get isAuthenticated$(): Observable<boolean> {
    return this._authSub$.asObservable();
  }

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private dialog: MatDialog
  ) {
    this.checkForLocalToken();
  }

  ngOnDestroy(): void {
    this._authSub$.next(false);
    this._authSub$.complete();
  }

  public checkForLocalToken() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const payload = this.decodeToken(accessToken);
      this._authSub$.next(new Date().getTime() < payload.exp * 1000);
      this.cognitoService.setCurrentCognitoUser();
      // this.cognitoService.setLabName(accessToken);
    }
  }

  public login(username: string, password: string): Observable<void> {
    return this.cognitoService
      .authenticate({
        Username: username,
        Password: password,
      })
      .pipe(map((accesToken: string) => this.handleSignInResponse(accesToken)));
  }

  public logout(redirect: string) {
    this._authSub$.next(false);
    this.cognitoService.eraseUserDisplayName();
    this.cognitoService.eraseLabName();
    localStorage.removeItem('access_token');
    this.router.navigate([redirect]);
  }

  private handleSignInResponse(accesToken: string): void {
    this._authSub$.next(true);
    localStorage.setItem('access_token', accesToken);
  }

  private decodeToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadinit = Buffer.from(base64, 'base64').toString('ascii');
    return JSON.parse(payloadinit);
  }

  public async forgotPassword(username = ''): Promise<boolean> {
    const dialogData = await this.dialog
      .open<
        ForgotPasswordDialogComponent,
        ForgotPasswordDialogData,
        ForgotPasswordDialogData
      >(ForgotPasswordDialogComponent, {
        height: '620px',
        width: '450px',
        data: {
          newPassword: '',
          username,
          verificationCode: '',
        },
      })
      .afterClosed()
      .toPromise();
    const emptyData: ForgotPasswordDialogData = {
      newPassword: '',
      username: '',
      verificationCode: '',
    };
    return this.cognitoService.resetForgottenPassword(dialogData || emptyData);
  }
}
