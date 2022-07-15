import { TestBed } from '@angular/core/testing';
import { AboutService, DevModeService } from './about.service';

let mockDevModeService = jasmine.createSpyObj(DevModeService, [
  'isDevMode',
  'environment',
]);

describe('AboutService', () => {
  let service: AboutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DevModeService, useValue: mockDevModeService }],
    });
    service = TestBed.inject(AboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('version', () => {
    it('should return the current version from environment', () => {
      mockDevModeService.environment.and.returnValue({ version: '12345' });
      expect(service.version()).toBe('12345');
    });
  });

  describe('buildModeString', () => {
    it('should return "development" if the current version is development', () => {
      mockDevModeService.isDevMode.and.returnValue(true);
      expect(service.buildModeString()).toBe('development');
    });
    it('should return "production" if the current version is not development', () => {
      mockDevModeService.isDevMode.and.returnValue(false);
      expect(service.buildModeString()).toBe('production');
    });
  });

  describe('sandboxString', () => {
    it('should return "enabled" if the current environment is a sandbox environment', () => {
      mockDevModeService.environment.and.returnValue({ sandbox: true });
      expect(service.sandboxString()).toBe('enabled');
    });
    it('should return "disabled" if the current environment is not a sandbox environment', () => {
      mockDevModeService.environment.and.returnValue({ sandbox: false });
      expect(service.sandboxString()).toBe('disabled');
    });
  });

  describe('isSandbox', () => {
    it('should return true if the current environment is a sandbox environment', () => {
      mockDevModeService.environment.and.returnValue({ sandbox: true });
      expect(service.isSandbox()).toBeTrue();
    });
    it('should return false if the current environment is not a sandbox environment', () => {
      mockDevModeService.environment.and.returnValue({ sandbox: false });
      expect(service.isSandbox()).toBeFalse();
    });
  });
});
