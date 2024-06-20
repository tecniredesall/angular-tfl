import { Observable } from 'rxjs';

import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../config/uris-config';
import { LoginInstanceModel } from '../../utils/models/login-intance.model';
import { LoginModel } from '../../utils/models/login.model';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private http: HttpClient;
    session: string;

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    /**
     * Get instance model
     * @param data model to send
     */
    public getInstanceService(data: LoginInstanceModel): Observable<any> {
        const urlApi = `${URIS_CONFIG.BASE_URI}${URIS_CONFIG.SIGN_IN}`;
        return this.http.post<any>(urlApi, data);
    }
    /**
     * set user in session
     * @param model user data
     * @param uriApi uri to send data
     */
    public login(model: LoginModel): Observable<any> {
        const urlApi = `${model.uri_owner}/sign`;
        return this.http.post<any>(urlApi, model);
    }
}
