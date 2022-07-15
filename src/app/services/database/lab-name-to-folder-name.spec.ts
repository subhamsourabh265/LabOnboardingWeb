import { LabName, labNameToFolderName } from './lab-name-to-folder-name';

describe('labNameToFolderName', () => {
  it('should return the empty string if given no parameters', () => {
    expect(labNameToFolderName()).toBe('');
  });
  it('should return the empty string if given an unrecognized lab name', () => {
    expect(labNameToFolderName('test' as LabName)).toBe('');
  });
  it('should return the name of the S3 folder for the lab', () => {
    expect(labNameToFolderName(LabName.redwood)).toBe('Redwood');
  });
});
