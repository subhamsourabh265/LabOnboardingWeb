import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-onb-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  constructor() {}
  @Input() text: string = '';
}
