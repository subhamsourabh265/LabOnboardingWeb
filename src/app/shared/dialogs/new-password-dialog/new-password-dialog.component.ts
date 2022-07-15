import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoService } from 'src/app/services/cognito/cognito.service';

export interface NewPasswordConfirmationDialogData {
  newPassword: string;
  requiredAttributes: string[];
}

@Component({
  selector: 'app-new-password-dialog',
  templateUrl: './new-password-dialog.component.html',
  styleUrls: ['./new-password-dialog.component.scss'],
})
export class NewPasswordDialogComponent {
  confirmNewPassword: string = '';
  userAttributes: any = [];
  constructor(
    public dialogRef: MatDialogRef<CognitoService>,
    @Inject(MAT_DIALOG_DATA) public data: NewPasswordConfirmationDialogData
  ) {}

  onSubmit(): void {
    this.dialogRef.close({
      newPassword: this.data.newPassword,
      userAttributes: this.userAttributes,
    });
  }
}
