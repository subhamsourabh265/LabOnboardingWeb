import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CurrentYearPipe } from 'src/app/pipes/current-year.pipe';
import { AboutService } from 'src/app/services/about/about.service';
import { AboutDialogComponent } from './about-dialog.component';

let mockAboutService = jasmine.createSpyObj(AboutService, [
  'buildModeString',
  'version',
  'sandboxString',
]);

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutDialogComponent, CurrentYearPipe],
      imports: [MatIconModule, MatDialogModule],
      providers: [{ provide: AboutService, useValue: mockAboutService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modeString', () => {
    it('should return modeString from AboutService', () => {
      mockAboutService.buildModeString.and.returnValue('testMode');
      expect(component.modeString()).toBe('testMode');
    });
  });
  describe('version', () => {
    it('should return version from AboutService', () => {
      mockAboutService.version.and.returnValue('testVersion');
      expect(component.version()).toBe('testVersion');
    });
  });
  describe('sandboxString', () => {
    it('should return sandboxString from AboutService', () => {
      mockAboutService.sandboxString.and.returnValue('testsandboxString');
      expect(component.sandboxString()).toBe('testsandboxString');
    });
  });
});
