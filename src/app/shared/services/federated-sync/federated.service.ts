import { IWorkerSyncRequest, WorkerSyncRequest } from './../../models/worker-sync-request';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../../utils/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FederatedService {

  constructor(private _http: HttpClient) { }

  public updateFedeatedData(action: string): Observable<any> {
    const uri = `${CONSTANTS.API_WORKER_SYNC}/${URIS_CONFIG.WORKER_SYNC.PENDING_ACTIONS}`
    let requestSyncModel:IWorkerSyncRequest = new WorkerSyncRequest(action);
    return this._http.post(uri, requestSyncModel);
  }

  public syncTrummodityContracts(): Observable<any> {
    const uri = `${CONSTANTS.API_WORKER_SYNC}/${URIS_CONFIG.WORKER_SYNC.SYNC_CONTRACTS}`
    return this._http.post(uri, null);
  }
}
