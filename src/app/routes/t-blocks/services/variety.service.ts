import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    BlockCharacteristicModel, IBlockCharacteristicModel
} from '../models/block-characteristic.model';
import { TIVarietyModel, TVarietyModel } from '../models/variety.model';

@Injectable({
    providedIn: 'root',
})
export class VarietyService {
    constructor(private http: HttpClient) {}

    public fetchVariety(): Observable<Array<TIVarietyModel>> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PROD_VARIETY
        }`;

        return this.http.get(uri).pipe(
            map((result: any) => {
                let data: Array<any> = result;
                let variety: Array<TIVarietyModel> = [];
                data.forEach((d: any) => {
                    variety.push(new TVarietyModel(d));
                });
                return sortBykey(variety, 'name');
            })
        );
    }

    public getCoffeeVarieties(
        query?: string
    ): Observable<Array<BlockCharacteristicModel>> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_COFFEE_VARIETIES
        }?q=${query ?? ''}`;

        return this.http.get(uri).pipe(
            map(
                (result: any) => result.data as Array<IBlockCharacteristicModel>
            ),
            map((items) => items.map((i) => new BlockCharacteristicModel(i)))
        );
    }

    public getShadeVarieties(
        query?: string
    ): Observable<Array<BlockCharacteristicModel>> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_SHADE_VARIETIES
        }?q=${query ?? ''}`;

        return this.http.get(uri).pipe(
            map(
                (result: any) => result.data as Array<IBlockCharacteristicModel>
            ),
            map((items) => items.map((i) => new BlockCharacteristicModel(i)))
        );
    }

    public getSoilTypes(
        query?: string
    ): Observable<Array<BlockCharacteristicModel>> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_SOIL_TYPES
        }?q=${query ?? ''}`;

        return this.http.get(uri).pipe(
            map(
                (result: any) => result.data as Array<IBlockCharacteristicModel>
            ),
            map((items) => items.map((i) => new BlockCharacteristicModel(i)))
        );
    }
}
