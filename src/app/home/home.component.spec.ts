import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { CognitoService } from '../services/cognito/cognito.service';
import { LabName } from '../services/database/lab-name-to-folder-name.js';
// import { LabManagerService } from '../services/lab-manager/lab-manager.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';

let mockMatDialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj(
  'MatDialog',
  ['open']
);
let mockCognitoService: jasmine.SpyObj<CognitoService> = jasmine.createSpyObj(
  'CognitoService',
  ['getLabName', 'getUserDisplayName']
);

let mockAuthService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
  'AuthService',
  ['logout']
);

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        // MockComponent(DashboardComponent),
        MockComponent(SpinnerComponent),
      ],
      imports: [
        MatTooltipModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        // { provide: LabManagerService, useValue: mockLabManagerService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: CognitoService, useValue: mockCognitoService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logoutRequested', () => {
    it('should call the AuthService logout method if the response from the dialog is truthy', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({}),
        close: null,
      });
      mockAuthService.logout.calls.reset();
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      component.logoutRequested();
      tick();
      expect(mockAuthService.logout).toHaveBeenCalled();
    }));
    it('should not call the AuthService logout method if the response from the dialog is falsy', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of(false),
        close: null,
      });
      mockAuthService.logout.calls.reset();
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      component.logoutRequested();
      tick();
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    }));
    it('should open a dialog', fakeAsync(() => {
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({}),
        close: null,
      });
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      component.logoutRequested();
      tick();
      expect(mockMatDialog.open).toHaveBeenCalled();
    }));
  });
});
