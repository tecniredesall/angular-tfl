import { Injectable } from '@angular/core';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { AlertService } from '../alerts/alert.service';
import { ExportFilesService } from '../files/export-file.service';
import { ICSVProperty } from "../models/csv-properties.model";

@Injectable({
  providedIn: 'root'
})
export class CSVActionsService {

  private unknownFileProperties: Array<any> = [];

  constructor(
    private _exportFileService: ExportFilesService,
    private _alertService: AlertService,
    private _i18nPipe: I18nPipe
  ) { }

  public downloadLayout(title: string, properties: Array<ICSVProperty>): void {
    let cpObject = {};
    properties.forEach((p: ICSVProperty) => {
      Object.defineProperty(cpObject, p.column, {
        value: '',
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
    this._exportFileService.exportToCSV([cpObject], title);
  }

  public uploadFile(event: any, properties: Array<ICSVProperty>, validationCallback: (records:Array<any>) => boolean): Promise<Array<any>> {

    return new Promise((resolve: any) => {

      const files = event.srcElement.files;

      this.unknownFileProperties = [];

      if (this.isValidCSVFile(files[0])) {

        let input = event.target;

        const reader = new FileReader();

        reader.onload = () => {

          const csvData = reader.result;

          let data: Array<any> = (csvData as string).split(/\r\n|\n/);

          return resolve(
            this.processDataFromCSVFile(
              data,
              properties,
              validationCallback
            )
          );

        };

        reader.onerror = () => {

          this._alertService.error(this._i18nPipe.transform('error-file-reader'));

          return resolve(null);

        };

        reader.readAsText(input.files[0]);

      }
      else {

        this._alertService.error(
          this._i18nPipe.transform('valid-csv-file')
        );

        return resolve(null);

      }

    });

  }

  private isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  private processDataFromCSVFile(data: Array<any>, properties: Array<ICSVProperty>, validationCallback: (records:Array<any>) => boolean): Array<any> {

    let headersRow: Array<string> = this.getHeaderArray(data);

    let recordsData: Array<any> = this.getDataRecordsArrayFromCSVFile(data, headersRow, properties);

    if (this.unknownFileProperties.length > 0) {

      this._alertService.info(
        this._i18nPipe.transform('unknow-props-file')
      );

      return null;

    }
    else if (recordsData.length > 0) {

      let allRecordsValid: boolean = validationCallback(recordsData);

      return allRecordsValid ? recordsData : null;

    }
    else {

      this._alertService.info(
        this._i18nPipe.transform('empty-file')
      );

      return null;

    }

  }

  private getHeaderArray(csvRecordsArr: any): Array<string> {
    return (csvRecordsArr[0] as string).split(',');
  }

  private getDataRecordsArrayFromCSVFile(csvRecordsArray: Array<any>, headerArray: Array<string>, properties: Array<ICSVProperty>): Array<any> {

    let dataRecords: Array<any> = [];

    let hasUnknowProperties: boolean = false;

    this.unknownFileProperties = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {

      let stringRecord: string = (csvRecordsArray[i] as string).replace(/^\s+|\s+$|\"\",?/gm, '');

      if (stringRecord.length > 0) {

        let currentRecord: Array<string> = stringRecord.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);

        let current: any = {};

        hasUnknowProperties = false;


        for (let j = 0; j < currentRecord.length; j++) {

          let known: any = properties.find((x) => this._i18nPipe.transform(x.column) === headerArray[j]);

          if (known) {

            let p: string = properties[j].property;

            current[p] = currentRecord[j].replace(/^\"+|\"+$|^\s+|\s+$/gm, '');

          } 
          else if (!this.unknownFileProperties.find(x => x === headerArray[j])) {

            this.unknownFileProperties.push(headerArray[j]);

            hasUnknowProperties = true;

          }

        }

        if (!hasUnknowProperties) {
          dataRecords.push(current);
        }

      }

    }

    return dataRecords;

  }

}
