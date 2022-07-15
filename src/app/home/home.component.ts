import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { CognitoService } from '../services/cognito/cognito.service';
// import { LabManagerService } from '../services/lab-manager/lab-manager.service';
import { SLIDE_DOWN_ANIMATION } from '../shared/animations/animations';
import { COLOR } from '../shared/constants';
import { ConfirmDialogComponent } from '../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { DialogOptions } from '../shared/dialogs/dialog-options';

@Component({
  selector: 'app-lab-onb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [SLIDE_DOWN_ANIMATION],
})
export class HomeComponent implements OnInit {
  public showEditProfile = false;
  public showSpinner = false;
  public selected = 'option2';

  constructor(
    // private labManager: LabManagerService,
    private dialog: MatDialog,
    private cognito: CognitoService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.showSpinner = true;
    // await this.labManager.retrieveLabInformation();
    this.showSpinner = false;
  }

  logo(): Observable<string> {
    // return this.labManager.getLogo();
    return of('assets/logo.PNG');
  }

  logoAlternateText(): Observable<string> {
    // return this.labManager.getLogoAltText();
    return of('assets/logo.PNG');
  }

  userDisplayName(): Observable<string> {
    return this.cognito.getUserDisplayName();
  }

  public logoutRequested() {
    const options: DialogOptions = {
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      titleColor: COLOR.geneicd_red,
      showContactSupport: false,
    };
    this.dialog
      .open(ConfirmDialogComponent, { data: options })
      .afterClosed()
      .toPromise()
      .then((x) => x && this.authService.logout('/'));
  }
}
