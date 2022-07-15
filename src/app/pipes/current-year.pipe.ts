import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentYear',
})
export class CurrentYearPipe implements PipeTransform {
  year = new Date().getFullYear();
  transform(value: unknown, ...args: unknown[]): unknown {
    // return this.year > 2022 ?  '-'+ this.year: '';
    return this.year;
  }
}
