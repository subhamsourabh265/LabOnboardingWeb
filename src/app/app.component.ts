import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { COLOR } from './shared/constants';
import { AboutDialogComponent } from './shared/dialogs/about-dialog/about-dialog.component';
import { ConfirmDialogComponent } from './shared/dialogs/confirm-dialog/confirm-dialog.component';
import { DialogOptions } from './shared/dialogs/dialog-options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private dialog: MatDialog, private authService: AuthService) {}
  title = 'lab-onboarding';
  public logout() {
    const options: DialogOptions = {
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      titleColor: COLOR.geneicd_red,
      showContactSupport: false,
    };
    lastValueFrom(
      this.dialog.open(ConfirmDialogComponent, { data: options }).afterClosed()
    ).then((x) => x && this.authService.logout('/'));
  }

  public showAbout() {
    this.dialog.open<AboutDialogComponent>(AboutDialogComponent);
  }
}
