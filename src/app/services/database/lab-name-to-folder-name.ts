import { Map } from 'immutable';

export enum LabName {
  redwood = 'Redwood Lab Services',
  testlab = 'Test Lab',
  example = 'Example Lab',
  none = '',
}

enum LabFolderName {
  redwood = 'Redwood',
  testlab = 'TestLab',
  none = '',
}

const labFolderMap = Map<LabName, LabFolderName>([
  [LabName.redwood, LabFolderName.redwood],
  [LabName.testlab, LabFolderName.testlab],
]);

export function labNameToFolderName(labName = LabName.none): LabFolderName {
  return labFolderMap.get(labName, LabFolderName.none);
}
