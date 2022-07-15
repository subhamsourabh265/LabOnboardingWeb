import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogOptions } from '../dialog-options';
import { ConfirmDialogComponent } from './confirm-dialog.component';

const testDataNoSupportButton: DialogOptions = {
  cancelButtonText: 'cancel button',
  confirmButtonText: 'confirm button',
  showContactSupport: false,
  message: 'text',
  title: 'title',
  titleColor: 'purple',
};

let mockMatDialogRef: jasmine.SpyObj<
  MatDialogRef<ConfirmDialogComponent, any>
> = jasmine.createSpyObj('MatDialogRef', ['close']);

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.data = testDataNoSupportButton;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should put the title text in the title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-title'
    );
    const titleText = title.textContent;
    expect(titleText?.trim()).toBe('title');
  });

  it('should render the title text the requested color', () => {
    const heading: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-title'
    );
    const headingStyle = heading.style;
    expect(headingStyle.color).toBe('purple');
  });

  it('should put message in message area', () => {
    const textSection: HTMLElement = fixture.nativeElement.querySelector(
      '.confirm-dialog-message'
    );
    const textSectionText = textSection.textContent;
    expect(textSectionText?.trim()).toBe('text');
  });

  it('should put confirm button text in confirm button', () => {
    const confirmButton: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-confirm-button'
    );
    const confirmButtonText = confirmButton.textContent;
    expect(confirmButtonText?.trim()).toBe('confirm button');
  });

  it('should put cancel button text in cancel button', () => {
    const cancelButton: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-cancel-button'
    );
    const cancelButtonText = cancelButton.textContent;
    expect(cancelButtonText?.trim()).toBe('cancel button');
  });

  it('should render exactly two buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
  });

  it('should close and return true when confirm button is clicked', () => {
    mockMatDialogRef.close.calls.reset();
    const confirmButton: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-confirm-button'
    );
    confirmButton.click();
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close and return falsy when cancel button is clicked', () => {
    mockMatDialogRef.close.calls.reset();
    const cancelButton: HTMLElement = fixture.nativeElement.querySelector(
      '#confirm-dialog-cancel-button'
    );
    cancelButton.click();
    expect(mockMatDialogRef.close.calls.mostRecent().args[0]).toBeFalsy();
  });
});
