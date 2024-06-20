import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CompanyInfoModel } from '../models/company-info.model';
import { LayoutService } from '../services/layout.service';
import { Router } from '@angular/router';
import { AlertService } from '../../utils/alerts/alert.service';
import { I18nPipe } from '../../i18n/i18n.pipe';
declare let $: any;

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css'],
})
export class CompanyInfoComponent implements OnInit {

  @Output() success = new EventEmitter();
  @Output() close = new EventEmitter();
  public updateCompany = false;
  public companyInfo: CompanyInfoModel = new CompanyInfoModel();
  public updatingInfo = false;
  public currentCompany = new CompanyInfoModel();
  public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // LOCATIONS
  public locations = [];
  public locationSelected: any;
  public metrics = [];
  public metricsSelected: any;

  public pending = null;
  public hasRequestPending: boolean;

  constructor(private _layoutService: LayoutService,
              private _rote: Router,
              private _alert: AlertService,
              private _i18nPipe: I18nPipe) { }

  ngOnInit() {
    this.metrics = [
      { name: this._i18nPipe.transform('Imperial system'), id: 1 },
      { name: this._i18nPipe.transform('Metric system'), id: 2 }
    ];
    $('#openCompanyModal').click();
    this.getAvailableLocations();
    this.getCompanyInfo();
  }
  private getAvailableLocations() {
    this._layoutService.getLocation().subscribe(
      result => {
        this.locations = result;
      }, error => {
        this._alert.showAlert(error.status, '');
      }
    );
  }
  /**
   * Update company info
   */
  public updateCompanyInfo(isCudReq = false): void {
    if (isCudReq) {
      this.currentCompany.id = this.pending.cudrequest_id;
    }
    this.updatingInfo = true;
    this.currentCompany.general = this.currentCompany.decimals_in_general;
    this.currentCompany.ticket = this.currentCompany.decimals_in_tickets;
    this.currentCompany.money = this.currentCompany.decimals_for_money;
    this.currentCompany.characteristics = this.currentCompany.decimal_for_characteristics;
    this.currentCompany.metric = this.currentCompany.metric_system_id;
    this._layoutService.createCompanyInfo(this.currentCompany).subscribe(
      (result) => {
        this.updatingInfo = false;
        this.updateCompany = false;
        // this.companyInfo = result.data;
        localStorage.setItem('metric', this.currentCompany.metric.toString());
        // this._layoutService.languaje.next(true);
        const decimals = {
          money: this.currentCompany.money,
          general: this.currentCompany.general,
          tickets: this.currentCompany.ticket
        };
        localStorage.setItem('decimals', JSON.stringify(decimals));
        this._alert.success(this._i18nPipe.transform('success-sent-edit-request'));
        this._layoutService.company.next(true);
        this.success.emit();
      },
      error => {
        this.updatingInfo = false;
        this.updateCompany = false;
      }
    );
  }
  /**
   * destroy modal
   */
  public destroyModal(): void {
    this.updateCompany = false;
    this.updatingInfo = false;
  }

  public hasPending(): boolean {
    if (this.pending !== null) {
      return this.pending.error_code === 0;
    } else {
      return false;
    }
  }
  /**
   * show error code
   * @param error error code
   */
  public showRequestInfo(error): void {
    let msg = this._i18nPipe.transform(error + 'msg');
    if (error === 422 || error === 406) {
      msg += ` ${this._i18nPipe.transform('this-companyInfo')}, ${this._i18nPipe.transform('please-try-again')}.`;
    }
    this._alert.info(msg);
  }
  public setLocation(location) {
    this.currentCompany.default_location = location.id;
  }
  /**
   * Set item
   * @param value system selected
   */
  public setSystem(value): void {
    this.currentCompany.metric_system_id = value.id;
  }
  /**
   * Get company info
   */
  public getCompanyInfo(): void {
    this.updateCompany = true;
    this.updatingInfo = true;
    this.currentCompany = new CompanyInfoModel();
    this._layoutService.getCompanyInfo().subscribe(
      (result) => {
        if (result.pending.length > 0) {
          this.pending = result.pending[0];
          this.currentCompany = this.pending;
          this.metricsSelected = this.metrics.find(x => x.id === Number.parseInt(this.pending.metric_system_id, 0));
          this.locationSelected = this.locations.find(x => x.id === Number.parseInt(this.pending.default_location, 0));
        } else {
          this.currentCompany = result.data;
          this.metricsSelected = this.metrics.find(x => x.id === this.currentCompany.metric_system_id);
          this.locationSelected = this.locations.find(x => x.id === this.currentCompany.default_location);
        }
        this.updatingInfo = false;

      }
    );
  }
}
