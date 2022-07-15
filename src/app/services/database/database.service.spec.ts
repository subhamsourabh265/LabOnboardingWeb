import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  FHIRcommunication,
  FHIRdiagnosticReport,
  FHIR_DOMAIN_RESOURCE,
} from '@geneicd/fhir-library';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AboutService } from '../about/about.service';
import { CognitoService } from '../cognito/cognito.service';
import { DatabaseService } from './database.service';

let mockCognitoService = jasmine.createSpyObj(CognitoService, [
  'getLabName',
  'getIdToken',
]);
let mockHttpClient = jasmine.createSpyObj(HttpClient, ['get', 'post']);
let mockAboutService = jasmine.createSpyObj<AboutService>('AboutService', [
  'isSandbox',
]);

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CognitoService, useValue: mockCognitoService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: AboutService, useValue: mockAboutService },
      ],
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getResource', () => {
    it('should invoke http get', fakeAsync(() => {
      mockCognitoService.getLabName.and.returnValue(of('Redwood'));
      mockHttpClient.get.and.returnValue(of({}));
      const url = environment.gatewayURL;
      environment.gatewayURL = 'test';
      service.getResource<FHIRcommunication>(
        FHIR_DOMAIN_RESOURCE.communication,
        'geneicd-01FHPE2W9ESNRQ6919AJVFGD51'
      );
      tick();
      expect(mockHttpClient.get).toHaveBeenCalled();
      environment.gatewayURL = url;
    }));
    it('should return an empty object if given no parameters', async () => {
      spyOn(console, 'error'); // to suppress the error message
      const result = await service.getResource();
      expect(result).toEqual({});
    });
  });

  describe('readRequisitions', () => {
    it('should get IDs from listRequisitions', async () => {
      spyOn(service, 'listRequisitions').and.resolveTo([
        'geneicd-01FHPE2W9ESNRQ6919AJVFGD51',
        'geneicd-01FHPE2W9ESNRQ6919AJVFGD51_version1',
      ]);
      await service.readRequisitions();
      expect(service.listRequisitions).toHaveBeenCalled();
    });
  });

  describe('readDiagnosticReportPreviews', () => {
    it('should get IDs from listDiagnosticReportPreviews', async () => {
      spyOn(service, 'listDiagnosticReportPreviews').and.resolveTo([
        'test.json',
      ]);
      spyOn(service.parser, 'parse').and.returnValue({
        ListBucketResult: {
          Contents: [],
        },
      });
      mockCognitoService.getLabName.and.returnValue(of('TestLab'));
      mockHttpClient.get.and.returnValue(of({}));
      await service.readDiagnosticReportPreviews();
      expect(service.listDiagnosticReportPreviews).toHaveBeenCalled();
    });
  });

  describe('listRequisitions', () => {
    it('should invoke an http GET in the sandbox', async () => {
      const previous = environment.gatewayURL;
      mockCognitoService.getLabName.and.returnValue(of('TestLab'));
      mockCognitoService.getIdToken.and.resolveTo('token');
      mockHttpClient.get.and.returnValue(of([]));
      mockAboutService.isSandbox.and.returnValue(true);
      spyOn(service.parser, 'parse').and.returnValue({
        ListBucketResult: {
          Contents: [],
        },
      });
      environment.gatewayURL = 'testgateway/';
      await service.listRequisitions();
      expect(mockHttpClient.get).toHaveBeenCalled();
      environment.gatewayURL = previous;
    });
    it('should invoke an http GET outside the sandbox', async () => {
      const previous = environment.gatewayURL;
      mockCognitoService.getLabName.and.returnValue(of('TestLab'));
      mockCognitoService.getIdToken.and.resolveTo('token');
      mockHttpClient.get.and.returnValue(of({ Contents: [] }));
      mockAboutService.isSandbox.and.returnValue(false);
      environment.gatewayURL = 'testgateway/';
      await service.listRequisitions();
      expect(mockHttpClient.get).toHaveBeenCalled();
      environment.gatewayURL = previous;
    });
  });

  describe('listDiagnosticReportPreviews', () => {
    it('should invoke an http GET in the sandbox', async () => {
      const previous = environment.gatewayURL;
      mockCognitoService.getLabName.and.returnValue(of('TestLab'));
      mockCognitoService.getIdToken.and.resolveTo('token');
      mockHttpClient.get.and.returnValue(of([]));
      mockAboutService.isSandbox.and.returnValue(true);
      spyOn(service.parser, 'parse').and.returnValue({
        ListBucketResult: {
          Contents: [
            { Key: 'lab/resource/test.json' },
            { Key: 'another/resource/test.json' },
          ],
        },
      });
      environment.gatewayURL = 'testgateway/';
      await service.listDiagnosticReportPreviews();
      expect(mockHttpClient.get).toHaveBeenCalled();
      environment.gatewayURL = previous;
    });
  });

  describe('postResource', () => {
    const reportPayload: Partial<FHIRdiagnosticReport> = {
      presentedForm: [{ hash: 'hash' }],
    };
    it('should invoke http post', fakeAsync(() => {
      mockCognitoService.getLabName.and.returnValue(of('Redwood'));
      mockHttpClient.post.and.returnValue(of({}));
      const url = environment.resultGatewayUrl;
      environment.resultGatewayUrl = 'test';
      service.postResource<FHIRcommunication>(reportPayload);
      tick();
      expect(mockHttpClient.post).toHaveBeenCalled();
      environment.resultGatewayUrl = url;
    }));
    it('should return an empty object if given no resultGatewayUrl', async () => {
      environment.resultGatewayUrl = '';
      const result = await service.postResource(reportPayload);
      expect(result).toEqual({});
    });
  });
});
