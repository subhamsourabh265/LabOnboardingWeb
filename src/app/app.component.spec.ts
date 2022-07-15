import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

let mockMatDialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj(
  'MatDialog',
  ['open']
);

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, MockComponent(MainToolbarComponent)],
      providers: [{ provide: MatDialog, useValue: mockMatDialog }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lab-onboarding'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('lab-onboarding');
  });

  describe('logout', () => {
    it('should open a dialog', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      let dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({}),
        close: null,
      });
      mockMatDialog.open.and.returnValue(dialogRefSpyObj);
      app.logout();
      tick();
      expect(mockMatDialog.open).toHaveBeenCalled();
    }));
  });

  describe('showAbout', () => {
    it('should open a dialog', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      mockMatDialog.open.calls.reset();
      app.showAbout();
      expect(mockMatDialog.open).toHaveBeenCalled();
    });
  });
});
