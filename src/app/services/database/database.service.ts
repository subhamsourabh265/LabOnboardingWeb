import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DiagnosticReportPreview,
  FHIRdiagnosticReport,
  FHIRserviceRequest,
  FHIR_DOMAIN_RESOURCE,
} from '@geneicd/fhir-library';
import { XMLParser } from 'fast-xml-parser';
import { lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AboutService } from '../about/about.service';
import { CognitoService } from '../cognito/cognito.service';
import { LabName, labNameToFolderName } from './lab-name-to-folder-name';
import { ListBucketContents } from './list-bucket-contents';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  parser = new XMLParser({
    isArray: /* istanbul ignore next */ (
      name,
      jpath,
      isLeafNode,
      isAttribute
    ) => name === 'Contents',
  });

  constructor(
    private cognito: CognitoService,
    private http: HttpClient,
    private about: AboutService
  ) {}

  private readResources<K>(
    resourceIDs: string[],
    resourceType: string
  ): Promise<K[]> {
    const getArray: Promise<K>[] = [];
    resourceIDs.forEach((id, index) => {
      getArray[index] = this.getResource<K>(resourceType, id);
    });
    return Promise.all(getArray);
  }

  public async readRequisitions(): Promise<Array<FHIRserviceRequest>> {
    const requisitionIDs = await this.listRequisitions();
    const filteredIds = requisitionIDs.filter(
      (id) => id.indexOf('version') === -1
    ); // Filter out any filenames that contain version in it.
    return this.readResources<FHIRserviceRequest>(
      filteredIds,
      FHIR_DOMAIN_RESOURCE.service_request
    );
  }

  public async readDiagnosticReportPreviews(): Promise<
    Array<DiagnosticReportPreview>
  > {
    const previewIDs = await this.listDiagnosticReportPreviews();
    return this.readResources<DiagnosticReportPreview>(
      previewIDs,
      'DiagnosticReportPreview'
    );
  }

  private async labFolderName(): Promise<string> {
    const labName = await this.cognito.getLabName().pipe(take(1)).toPromise();
    return labNameToFolderName(labName as LabName);
  }

  private async composeBaseURL(): Promise<string> {
    const labFolder = await this.labFolderName();
    return environment.gatewayURL + labFolder + '/';
  }

  private async composeResourceURL(
    resourceType: string,
    resourceID: string
  ): Promise<string> {
    const baseURL = await this.composeBaseURL();
    return baseURL + resourceType + '/' + resourceID + '.json';
  }

  private async composeHeaders(): Promise<{ headers: HttpHeaders }> {
    const idToken = await this.cognito.getIdToken();
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken,
      }),
    };
  }

  private async invokeGet<K>(url: string): Promise<K> {
    const httpOptions = await this.composeHeaders();
    return lastValueFrom(this.http.get<K>(url, httpOptions));
    // .toPromise();
  }

  public async getResource<K>(resourceType = '', resourceID = ''): Promise<K> {
    if (resourceType && resourceID) {
      const url = await this.composeResourceURL(resourceType, resourceID);
      return this.invokeGet<K>(url);
    } else {
      /* eslint-disable no-console */ console.error(
        'Cannot get resource. Invalid request information:',
        resourceType,
        resourceID
      );
      return Promise.resolve<K>({} as K);
    }
  }

  public async postResource<K>(data: Partial<FHIRdiagnosticReport>) {
    if (environment.resultGatewayUrl) {
      const httpOptions = {
        headers: new HttpHeaders({
          'x-api-key': environment.resultGatewayKey,
        }),
      };
      return lastValueFrom(
        this.http.post<K>(environment.resultGatewayUrl, data, httpOptions)
      );
      // .toPromise();
    }
    return Promise.resolve<K>({} as K);
  }

  private async listResourceIDs(resourceType: string): Promise<string[]> {
    const labFolder = await this.labFolderName();
    const url =
      environment.gatewayURL.slice(0, -1) +
      '&prefix=' +
      labFolder +
      '/' +
      resourceType +
      '/';
    const idToken = await this.cognito.getIdToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + idToken,
    });
    let contents: ListBucketContents[];
    if (this.about.isSandbox()) {
      const xmlString = await lastValueFrom(
        this.http.get(url, { headers, responseType: 'text' })
      );
      // .toPromise();
      contents =
        this.parser.parse(xmlString).ListBucketResult.Contents ||
        /* istanbul ignore next */ [];
    } else {
      const json = (await lastValueFrom(
        this.http.get(url, { headers, responseType: 'json' })
      )) as { Contents: ListBucketContents[] };
      // .toPromise()) as { Contents: ListBucketContents[] };
      contents = json.Contents || /* istanbul ignore next */ [];
    }
    return contents
      .filter((x) => x.Key.includes('.json'))
      .map((x) => x.Key.split('/')[2].split('.')[0]);
  }

  public async listRequisitions(): Promise<string[]> {
    return this.listResourceIDs(FHIR_DOMAIN_RESOURCE.service_request);
  }

  public async listDiagnosticReportPreviews(): Promise<string[]> {
    return this.listResourceIDs('DiagnosticReportPreview');
  }
}
