import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth.service';
import { CognitoService } from '../../../services/cognito/cognito.service';
import { FADE_IN_ANIMATION } from '../../animations/animations';

export interface ForgotPasswordDialogData {
  username: string;
  verificationCode: string;
  newPassword: string;
}

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
  animations: [FADE_IN_ANIMATION],
})
export class ForgotPasswordDialogComponent {
  public confirmNewPassword = '';
  public showCodeSent = false;

  constructor(
    public dialogRef: MatDialogRef<AuthService>,
    private cognito: CognitoService,
    @Inject(MAT_DIALOG_DATA) public data: ForgotPasswordDialogData
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  enableCodeRequest(): boolean {
    return this.data?.username?.length > 2 && this.data.username.includes('@');
  }

  requestVerificationCode(): Promise<boolean> {
    this.showCodeSent = true;
    return this.cognito
      .requestForgottenPasswordVerificationCode(this.data.username)
      .catch((error) => {
        /*eslint-disable no-console*/ console.error(
          'Error when trying to send verification code',
          error
        );
        return false;
      });
  }
}
