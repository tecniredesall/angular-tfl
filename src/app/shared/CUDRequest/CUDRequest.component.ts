import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../utils/alerts/alert.service';
import { I18nPipe } from '../i18n/i18n.pipe';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-CUDRequest',
  templateUrl: './CUDRequest.component.html',
  styleUrls: ['./CUDRequest.component.css']
})
export class CUDRequestComponent implements OnInit {

  @Input() entity: string;
  @Input() pendings: Array<any> = [];
  @Input() canUpdate = true;
  @Output() delete = new EventEmitter();
  @Output() update = new EventEmitter();
  public responseMsj: string;
  public srcIcon = '';
  constructor(private _alert: AlertService,
              private _i18n: I18nPipe) { }

  ngOnInit() {
    this.setIcon();
  }
  /**
   * Set icon path
   */
  private setIcon() {
    switch (this.entity) {
      case 'Sellers': {
        this.srcIcon = './../../../assets/img/icons/sellers_gris.png';
        break;
      }
      case 'Buyers': {
        this.srcIcon = './../../../assets/img/icons/buyers_gris.png';
        break;
      }
      case 'LinkedSellers': {
        this.srcIcon = './../../../../assets/img/icons/linkedSeller.png';
        break;
      }
      case 'Farms': {
        this.srcIcon = './../../../../assets/img/icons/farm_gris.png';
        break;
      }
      case 'Users': {
        this.srcIcon = './../../../assets/img/icons/buyers_gris.png';
        break;
      }
      case 'Commodities': {
        this.srcIcon = './../../../assets/img/icons/commo_gris.png';
        break;
      }
    }
  }

  /**
   * show error code
   * @param error error code
   */
  public showRequestInfo(error): void {
    let msg = this._i18n.transform(error + 'msg');
    if (error === 422 || error === 406) {
      msg += ` ${this._i18n.transform('this-' + this.entity)}, ${this._i18n.transform('please-try-again')}.`;
    }
    this._alert.info(msg);
  }
  /**
   * emit event from cudReq component
   */
  public emitEvent(action: string, item: any): void {
    if (action === 'edit') {
      this.update.emit(item);
    } else {
      this.delete.emit(item);
    }
  }
}
