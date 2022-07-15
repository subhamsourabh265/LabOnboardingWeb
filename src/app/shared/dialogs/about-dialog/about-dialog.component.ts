import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about/about.service';

@Component({
  selector: 'app-lab-onb-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
})
export class AboutDialogComponent {
  currentYear: any;

  constructor(private about: AboutService) {}

  public modeString(): string {
    return this.about.buildModeString();
  }

  public version(): string {
    return this.about.version();
  }

  public sandboxString(): string {
    return this.about.sandboxString();
  }
}
