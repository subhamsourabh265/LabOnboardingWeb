import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginValid = true;
  username = '';
  password = '';
  buttonDisabled = false;
  passwordChanged = false;
  showSpinner = false;
  private _destroySub$ = new Subject<void>();
  private loginSubscription = new Subscription();
  private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
    this.loginSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(
        filter((isAuthenticated: boolean) => isAuthenticated),
        takeUntil(this._destroySub$)
      )
      .subscribe((_) => this.router.navigateByUrl(this.returnUrl));
  }

  private async attemptLogin() {
    this.loginValid = true;
    this.showSpinner = true;
    this.buttonDisabled = true;
    this.passwordChanged = false;
    this.loginSubscription = this.authService
      .login(this.username, this.password)
      .subscribe(
        () => {
          this.buttonDisabled = false;
          this.showSpinner = false;
          this.loginValid = true;
          this.router.navigateByUrl('/home');
        },
        (error: any) => {
          this.loginValid = false;
          this.showSpinner = false;
          this.buttonDisabled = false;
          /*eslint-disable no-console*/ console.error(error);
        }
      );
  }

  private async setNewPassword(form: NgForm) {
    let success = await this.authService
      .forgotPassword(this.username)
      .catch((error) => /*eslint-disable no-console*/ console.error(error));
    if (success) {
      this.passwordChanged = true;
      this.password = '';
      form.resetForm();
    }
  }

  async onSubmit(form: NgForm, event?: SubmitEvent) {
    if (event?.submitter?.id === 'loginButton') {
      this.attemptLogin();
    } else if (event?.submitter?.id === 'forgotPasswordButton') {
      this.setNewPassword(form);
    }
  }
}
