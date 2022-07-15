import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CognitoService } from '../../../services/cognito/cognito.service';
import { NewPasswordDialogComponent } from './new-password-dialog.component';

let mockMatDialogRef = {
  close: (password: string) => of(),
};

describe('NewPasswordDialogComponent', () => {
  let component: NewPasswordDialogComponent;
  let fixture: ComponentFixture<NewPasswordDialogComponent>;
  let matDialogRef: MatDialogRef<any>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'Test@123' },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
      ],
    }).compileComponents();
    matDialogRef = TestBed.inject(MatDialogRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should close new password dialog', inject(
      [MatDialogRef],
      fakeAsync((matDialogRef: MatDialogRef<CognitoService>) => {
        expect(matDialogRef).toBeTruthy();
        component.onSubmit();
        expect(component.data.newPassword).not.toEqual([]);
      })
    ));
  });
});
