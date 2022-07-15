import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogOptions } from '../dialog-options';

@Component({
  selector: 'app-lab-onb-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  public titleStyle = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}

  ngOnInit(): void {
    this.titleStyle = 'color: ' + this.data.titleColor;
  }
}
