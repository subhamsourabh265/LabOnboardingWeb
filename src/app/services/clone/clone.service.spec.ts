import { TestBed } from '@angular/core/testing';
import { CloneService } from './clone.service';

describe('CloneService', () => {
  let service: CloneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clone', () => {
    it('should clone a simple object', () => {
      const simple = { str: '123', arr: [1, 3, 5] };
      expect(service.clone(simple)).toEqual(simple);
    });
  });
});
