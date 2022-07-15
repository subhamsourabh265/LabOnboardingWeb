import { CurrentYearPipe } from './current-year.pipe';

describe('CurrentYearPipe', () => {
  const pipe = new CurrentYearPipe();
  const year = new Date().getFullYear();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return current year', () => {
    expect(pipe.year).toBe(year);
  });

  it('should return current year', () => {
    if (pipe.year > 2022) {
      expect(pipe.transform('currentYear')).toBe(year);
    } else {
      expect(pipe.transform('currentYear')).toBe(year);
    }
  });
});
