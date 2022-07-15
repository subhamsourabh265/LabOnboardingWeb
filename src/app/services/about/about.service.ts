import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../../../environments/environment';

// DevModeService only exists to make it easier to mock values to test AboutService
// we do not count DevModeService as part of test coverage
@Injectable({
  providedIn: 'root',
})
export class DevModeService {
  /* istanbul ignore next */
  constructor() {}

  /* istanbul ignore next */
  public isDevMode() {
    return isDevMode();
  }

  /* istanbul ignore next */
  public environment() {
    return environment;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  constructor(private devMode: DevModeService) {}

  public version(): string {
    return this.devMode.environment().version;
  }

  public buildModeString(): string {
    if (this.devMode.isDevMode()) {
      return 'development';
    } else {
      return 'production';
    }
  }

  public sandboxString(): string {
    if (this.devMode.environment().sandbox) {
      return 'enabled';
    } else {
      return 'disabled';
    }
  }

  public isSandbox(): boolean {
    return this.devMode.environment().sandbox;
  }
}
