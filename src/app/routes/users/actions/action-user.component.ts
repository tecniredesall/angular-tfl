import { Component, OnInit, Output, EventEmitter, Input, HostListener, Inject } from '@angular/core';
import { UserModel } from '../models/user.model';
import { PermissionModel, PendingPermission } from '../models/permission.model';
import { UserService } from '../services/user.service';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { BlockUiComponent } from 'src/app/shared/block/block.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare let swal: any;
declare let $: any;

@Component({
  selector: 'app-action-user',
  templateUrl: './action-user.component.html',
  styleUrls: ['./action-user.component.css']
})
export class ActionUserComponent implements OnInit {


  @BlockUI('users-form') blockUI: NgBlockUI;
  blockTemplate: BlockUiComponent = BlockUiComponent;

  @Output() closeModal = new EventEmitter();
  @Output() success = new EventEmitter();
  @Output() successPermision = new EventEmitter();
  @Input() currentUserData: UserModel;
  @Input() permissions: PermissionModel[];
  @Input() option: string;
  @Input() pendings: Array<PendingPermission> = [];
  public status = true;
  public alphabeticalPattern = '^(^([a-zA-ZñÑáéíóúüÁÉÍÓÚÜ. ]{1})&*([a-z A-Z ñÑáéíóúüÁÉÍÓÚÜ. ]){0,255})*([a-zA-ZñÑáéíóúüÁÉÍÓÚÜ. ]{1})$';
  public alphanumericPattern =
    '^(^([a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ. ]{1})&*([a-z A-Z0-9 ñÑáéíóúüÁÉÍÓÚÜ. ]){0,255})*([a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ. ]{1})$';
  public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public userAction = 'new';
  public userData: UserModel;
  public disableButton = false;
  public perInProcess = 0;
  public currentPer: number;
  public hasProcessWithError = false;
  public hasProcessWithoutError = false;
  // tslint:disable: variable-name
  onAddPermission = new EventEmitter();
  constructor(
    private _userService: UserService,
    private _alert: AlertService,
    private dialogRef: MatDialogRef<ActionUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _i18n: I18nPipe) {
    this.option = this.data.option;

  }
  /**
   * init component
   */
  ngOnInit() {
    if (this.data) {
      this.userData = this.data.user;
      this.permissions = this.data.permissions;
      if (this.data.pendings) {
        this.currentPer = this.data.pendings.length;
        this.pendings = this.data.pendings;
      }
      if (this.data.option === 'edit') {
        this.userAction = 'Edit';
        this.currentUserData = JSON.parse(JSON.stringify(this.userData));
      }
    }
  }
  /**
   * check if has permission
   * @param idPermiso id permission
   */
  hasPermission(idPermiso): boolean {
    const exist = this.userData.securityArray.indexOf(idPermiso);
    return exist >= 0;
  }
  /**
   * has permission in pending sync
   * @param idPermiso id Permisio
   */
  public hasPermissionInProcess(idPermiso): boolean {
    const inProcess = this.pendings.find(x => x.process === idPermiso);
    return inProcess !== undefined;
  }
  /**
   * Check if permission has error for user
   * @param inPermisio id Permisio
   */
  public hasError(inPermisio): boolean {
    const inProcess = this.pendings.find(x => x.process === inPermisio);
    return inProcess.error_code !== 0;

  }
  /**
   * Cancel an action and close modal
   */
  public cancel(): void {
    this.dialogRef.close();
  }
  /**
   * Save new user
   */
  public newUserSave(): void {
    this.disableButton = true;
    this.blockUI.start();
    this.userData.permisos = this.permissions;
    this.userData.optionUser = this.option;
    this.userData.status = this.status ? 1 : 0;
    this._userService.saveUser(this.userData).subscribe(
      (result: any) => {
        this._alert.success(this._i18n.transform('success-sent-create-request'));
        this.blockUI.stop();
        const resComponent = {
          data: result.data.data,
          alert: 'create'
        };
        this.dialogRef.close(resComponent);
        // this.success.emit(resComponent);
        this.disableButton = false;
      },
      error => {
        if (error.status === 406) {
          const hasName = error.error.data.hasOwnProperty('name');
          if (hasName) {
            this._alert.errorTitle('Error!', this._i18n.transform(error.error.data.name[0]));
          } else {
            this._alert.errorTitle('Error!', this._i18n.transform(error.error.data.email[0]));
          }
        } else {
          this._alert.errorTitle('Error!', this._i18n.transform(error.status));
        }
        this.blockUI.stop();
        this.disableButton = false;
      }
    );
  }
  /**
   * Wdit user
   */

  statusChanged(event) {
    this.currentUserData.status = event;
  }
  public editUser(): void {
    if (JSON.stringify(this.currentUserData) !== JSON.stringify(this.userData)) {
      this.disableButton = true;
      this.blockUI.start();
      this.userData.permisos = this.permissions;
      this.userData.optionUser = this.option;
      this.userData.status = this.status ? 1 : 0;
      this._userService.editUser(this.userData).subscribe(
        (result: any) => {
          this._alert.success(this._i18n.transform('success-sent-edit-request'));
          this.blockUI.stop();
          const resComponent = {
            data: result.data.data,
            alert: 'edit'
          };
          this.dialogRef.close(resComponent);
          // this.success.emit(resComponent);
          this.disableButton = false;
        },
        error => {
          if (error.status === 406) {
            const hasName = error.error.data.hasOwnProperty('name');
            if (hasName) {
              this._alert.errorTitle('Error!', this._i18n.transform(error.error.data.name[0]));
            } else {
              this._alert.errorTitle('Error!', this._i18n.transform(error.error.data.email[0]));
            }
          } else {
            this._alert.errorTitle('Error!', this._i18n.transform(error.status));
          }
          this.blockUI.stop();
          this.disableButton = false;
        }
      );
    } else {
      if (this.currentPer === this.pendings.length) {
        this._alert.info(this._i18n.transform('you-havent-edited'));
      } else {
        this.dialogRef.close(true);
        // this.success.emit(null);
      }
    }
  }
  /**
   * show mesage if has error or pendingns process
   * @param evaluate error or pending
   */
  public showMsg(evaluate): boolean {
    if (evaluate === 'error') {
      return this.pendings.filter(x => x.error_code !== 0).length > 0;
    } else {
      return this.pendings.filter(x => x.error_code === 0).length > 0;
    }

  }
  /**
   * Show alert info
   * @param idPermision permissio
   */
  public showInfoError(idPermision) {
    const request = this.pendings.find(x => x.process === idPermision);
    let msg = this._i18n.transform(request.error_code + 'msg');
    if (request.error_code === 422 || request.error_code === 406) {
      msg += ` ${this._i18n.transform('this-per')},
       ${this._i18n.transform('please-try-again')}
       ${this._i18n.transform('or-delete-request')}`;
    }
    this.showAlert(msg, idPermision);
  }
  /**
   * Show alert and take desition
   * @param msg msg for show
   * @param idPermission permision id
   */
  private showAlert(msg: string, idPermission): void {
    swal({
      text: msg,
      icon: 'info',
      className: 'swal-center',
      buttons: {
        yes: {
          text: this._i18n.transform('send-again'),
          className: 'swal-button swal-button--cancel',
        },
        no: {
          text: this._i18n.transform('delete-request'),
          className: 'swal-button swal-button--danger',
        }
      }
    }).then((value) => {
      /**
       * Send new permision
       */
      this.perInProcess = idPermission;
      if (value === 'yes') {
        const request = this.pendings.find(x => x.process === idPermission);
        const model = {
          user: this.userData.id,
          process: idPermission,
          id: request.cudrequest_id,
          action: 1
        };
        this._userService.updateGrant(model).subscribe(
          () => {
            request.error_code = 0;
            this.perInProcess = 0;
            this._alert.success(this._i18n.transform('edit-request-sent'));
          },
          error => {
            this.perInProcess = 0;
            this._alert.errorTitle('Error!', this._i18n.transform(error.error.status));
          }
        );
        /**
         * delete request
         */
      } else if (value === 'no') {
        const request = this.pendings.find(x => x.process === idPermission);
        const model = {
          user: this.userData.id,
          process: idPermission,
          id: request.cudrequest_id,
          action: 3
        };
        this._userService.removeGrant(model).subscribe(
          () => {
            const index = this.pendings.indexOf(request);
            this.pendings.splice(index, 1);
            this._alert.success(this._i18n.transform('success-delete-request'));
            this.perInProcess = 0;
          },
          error => {
            this.perInProcess = 0;
            this._alert.errorTitle('Error!', this._i18n.transform(error.error.status));
          }
        );
      }
    });
  }
  /**
   * set permission
   * @param idPermission id per
   */
  public setPermision(idPermission: number): void {
    if (this.perInProcess === 0) {
      const existPending = this.pendings.find(x => x.process === idPermission);
      if (existPending !== null) {
        this.perInProcess = idPermission;
        const existItem = this.userData.securityArray.indexOf(idPermission);
        const model = {
          user: this.userData.id,
          process: idPermission,
          action: existItem < 0 ? 1 : 3
        };
        this._userService.addGrant(model).subscribe(
          (result) => {
            this.onAddPermission.emit(result);
            if (model.action === 3) {
              this.userData.securityArray.splice(existItem, 1);
            }
            this.pendings.push({ process: idPermission, error_code: 0 });
            this.perInProcess = 0;
            this._alert.success(model.action === 1
              ? this._i18n.transform('success-sent-add-grant-request')
              : this._i18n.transform('success-sent-remove-grant-request'));
          }, error => {
            this._alert.errorTitle('Error!', this._i18n.transform(error.error.status));
          });
      }
    }
  }

  /**
   * remove white spaces
   */
  public removeWhite(prop: string) {
    this.userData[prop] = this.userData[prop].replace(/^\s+/, '');
  }
  /**
   * listen when modal is closed
   * @param event event
   */
  @HostListener('window:mouseup', ['$event']) onKeydownHandler(event) {
    if (event.target.classList.contains('modal-user-action')) {
      this.cancel();
    }
  }
}
