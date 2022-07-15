import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ForgotPasswordDialogComponent } from './dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { NewPasswordDialogComponent } from './dialogs/new-password-dialog/new-password-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { CurrentYearPipe } from '../pipes/current-year.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

const MAT_MODULES = [
  MatCardModule,
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatToolbarModule,
  MatMenuModule,
  MatTooltipModule,
  MatSelectModule,
];

const COMPONENTS = [
  ForgotPasswordDialogComponent,
  NewPasswordDialogComponent,
  SpinnerComponent,
  CurrentYearPipe,
];

@NgModule({
  declarations: [...COMPONENTS, AboutDialogComponent, ConfirmDialogComponent],
  imports: [CommonModule, FormsModule, FlexLayoutModule, ...MAT_MODULES],
  exports: [...MAT_MODULES, FlexLayoutModule, ...COMPONENTS],
})
export class SharedModule {}
