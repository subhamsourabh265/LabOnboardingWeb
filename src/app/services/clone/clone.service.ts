import { Injectable } from '@angular/core';
import * as clone from 'rfdc';

const CLONE_OPTIONS: clone.Options = {
  circles: true,
  proto: true,
};

@Injectable({
  providedIn: 'root',
})
export class CloneService {
  constructor() {}

  public clone<T>(objectToClone: T): T {
    return clone(CLONE_OPTIONS)<T>(objectToClone);
  }
}
