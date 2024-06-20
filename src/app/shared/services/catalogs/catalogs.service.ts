import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { URIS_CONFIG } from '../../config/uris-config';
import { PaginationModel } from '../../utils/models/paginator.model';
import { PaginationService } from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

  private uri_owner = `${localStorage.getItem('uri-owner')}`;
  private paginationState: {
    professions: PaginationModel;
    schoolarships: PaginationModel;
    maritalStatus: PaginationModel;
  };
  private baseProfessionsUri = `${this.uri_owner}${URIS_CONFIG.API_PROFESSIONS}`;
  private baseSchoolarshipsUri = `${this.uri_owner}${URIS_CONFIG.API_SCHOLARSHIP}`;
  private baseMaritalStatusUri = `${this.uri_owner}${URIS_CONFIG.API_MARITAL_STATUS}`;
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {
    this.paginationState = {
      professions: null,
      schoolarships: null,
      maritalStatus: null,
    };
  }

  public getProfessions(query?: string): Observable<any[]> {
    const url = query
      ? `${this.baseProfessionsUri
      }?q=${query.toLowerCase()}`
      : `${this.baseProfessionsUri}`;
    return this.http.get(url).pipe(
      tap((r: any) => {
        this.paginationState.professions = { ...r };
        this.paginationService.setMultipagination(
          this.paginationState
        );
      }),
      map((r: any) => r.data)
    );
  }

  public getProfession(professionId: number): Observable<any> {
    return this.http
      .get(`${this.baseProfessionsUri}/${professionId}`)
      .pipe(map((r: any) => r.data));
  }

  public appendData(next_page_uri: string, control_name: string) {
    return this.http.get(next_page_uri).pipe(
      map((r: any) => {
        this.paginationState[control_name] = { ...r };
        this.paginationService.setMultipagination(
          this.paginationState
        );
        r.data.control = control_name; // Control to append data to
        return r.data;
      })
    );
  }

  public getSchoolarships(query?: string): Observable<any[]> {
    const url = query
      ? `${this.baseSchoolarshipsUri
      }?q=${query.toLowerCase()}`
      : `${this.baseSchoolarshipsUri}`;
    return this.http.get(url).pipe(
      tap((r: any) => {
        this.paginationState.schoolarships = { ...r };
        this.paginationService.setMultipagination(
          this.paginationState
        );
      }),
      map((r: any) => r.data)
    );
  }

  public getSchoolarship(schoolarshipId: number): Observable<any> {
    return this.http
      .get(`${this.baseSchoolarshipsUri}/${schoolarshipId}`)
      .pipe(map((r: any) => r.data));
  }

  public getMaritalStatuses(query?: string): Observable<any[]> {
    const url = query
      ? `${this.baseMaritalStatusUri
      }?q=${query.toLowerCase()}`
      : `${this.baseMaritalStatusUri}`;
    return this.http.get(url).pipe(
      tap((r: any) => {
        this.paginationState.maritalStatus = { ...r };
        this.paginationService.setMultipagination(
          this.paginationState
        );
      }),
      map((r: any) => r.data)
    );
  }

  public getMaritalStatus(maritalStatusId: number): Observable<any> {
    return this.http
      .get(`${this.baseMaritalStatusUri}/${maritalStatusId}`)
      .pipe(map((r: any) => r.data));
  }
}
