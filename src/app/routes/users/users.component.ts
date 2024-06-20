import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserService } from './services/user.service';
import { UserModel, SecurityPendingUser } from './models/user.model';
import { UserViewEnum } from './models/user-view.enum';
import { PermissionModel, PendingPermission } from './models/permission.model';
import { AlertService } from '../../shared/utils/alerts/alert.service';
import { NotificationService } from '../../shared/utils/notifications/services/notification.service';
import { I18nPipe } from '../../shared/i18n/i18n.pipe';
import { I18nService } from '../../shared/i18n/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionUserComponent } from './actions/action-user.component';
import { BlockService } from 'src/app/shared/block/block.service';

declare let $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('userList', { read: ViewContainerRef, static: true }) entryUsers: ViewContainerRef;
  @ViewChild('usersDelete', { read: ViewContainerRef, static: true }) entryUserDelete: ViewContainerRef;
  @ViewChild('securityList', { read: ViewContainerRef, static: true }) entrySecurity: ViewContainerRef;
  @ViewChild('securityDelete', { read: ViewContainerRef, static: true }) entrySecurityDelete: ViewContainerRef;

  private userList = 'userList';
  private usersDelete = 'usersDelete';
  private securityList = 'securityList';
  private securityDelete = 'securityDelete';

  public users: Array<UserModel> = [];
  public viewOptions = UserViewEnum;
  public optionView: UserViewEnum = UserViewEnum.Principal;
  public permissions: PermissionModel[];
  public userData: UserModel = new UserModel();
  public optionUser: string;
  public usersPendings: Array<any> = [];
  public grantPendings: Array<any> = [];
  public userGrantsPendings: Array<PendingPermission> = [];
  public disableButton = false;
  public userWithProcess: Array<SecurityPendingUser> = [];
  public currentSecurity: SecurityPendingUser;
  public securityMsg: string;
  public isCudReq = false;
  public uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}`;
  public nextUrl: string;
  // tslint:disable: variable-name
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private _alert: AlertService,
    private _noty: NotificationService,
    private _i18n: I18nPipe,
    private _i18nService: I18nService,
    private blockService: BlockService) {
    this._i18nService.state.subscribe(
      () => {
        this.getUsers(this.uri);
      }
    );
  }
  /**
   * init component
   */
  ngOnInit() {
    this.getUsers(this.uri);
  }
  /**
   * get list of users
   */
  private getUsers(uri: string): void {
    this.userWithProcess = [];
    this.blockService.startModal(this.entryUsers, this.userList);
    this.blockService.startModal(this.entrySecurity, this.securityList);
    this.userService.getUsers(uri).subscribe(
      (result: any) => {
        if (result) {
          this.usersPendings = result.pending ? result.pending.filter(x => x.entity_name === 'Users') : [];
          this.grantPendings = result.pending ? result.pending.filter(x => x.entity_name !== 'Users') : [];
          // this.users = result.data.data;
          result.data.data.forEach(item => {
            this.users.push(item);
          });
          this.getPermissions();
        }
        this.nextUrl = result.data.next_page_url;
        this.blockService.stop(this.userList);
      },
      error => {
        this.blockService.stop(this.userList);
        this._alert.showAlert(error.status, error.error.message || '');
      }
    );
  }
  /**
   * Build users array
   * @param grantsPendings pendings process
   * @param users list users
   */
  buildArrays(grantsPendings: Array<any>, users: Array<UserModel>) {
    this.userWithProcess = [];
    grantsPendings.forEach(item => {
      if (item !== undefined) {
        const user = users.find(us => us.id === item.user);
        if (user !== undefined) {
          const permission = this.permissions.find(x => x.id === item.process);
          const current: SecurityPendingUser = {
            user: item.user,
            cudrequest_id: item.cudrequest_id,
            error_code: item.error_code,
            grant: permission.description,
            process: item.process,
            userData: user,
            name: user.name,
          };
          this.userWithProcess.push(current);
        }
      }
    });
    // order by name
    this.userWithProcess.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    this.blockService.stop(this.securityList);
  }
  /**
   * Get permissions list
   */
  private getPermissions(): void {
    this.userService.getPermisions().subscribe(
      (result) => {
        this.permissions = result.data;
        this.buildArrays(this.grantPendings, this.users);
      }
    );
  }
  /**
   * new user
   */
  public newUser(): void {
    const dialogRef = this.dialog.open(ActionUserComponent, {
      width: '350px',
      height: '675px',
      data: {
        user: new UserModel(),
        option: 'new',
        permissions: this.permissions,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { return; }
      this.refreshData(res);
    });
  }
  /**
   * Edit user modal
   * @param user user to edit
   */
  public async editUser(user, isCudReq = false): Promise<void> {
    this.userGrantsPendings = [];
    this.optionUser = 'edit';
    if (isCudReq) {
      user.securityArray = await this.getCurrentPermisions(user.id);
      this.optionUser = 'edit-req';
    }
    this.userGrantsPendings = await this.getInProgressPermission(user.id);

    const dialogRef = this.dialog.open(ActionUserComponent, {
      width: '500px',
      height: '675px',
      data: {
        user,
        pendings: this.userGrantsPendings,
        option: this.optionUser,
        permissions: this.permissions,
      }
    });
    dialogRef.componentInstance.onAddPermission.subscribe((res) => {
      this.refreshSecurity({alert: 'edited'});
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { return; }
      this.refreshData(res);
    });
  }

  /**
   * Edit security grant modal
   * @param pending pendig to edit
   */
  public editSecurityGrant(pending): void {
    this.currentSecurity = new SecurityPendingUser();
    this.isCudReq = true;
    this.securityMsg = this._i18n.transform(pending.error_code + 'msg');
    if (pending.error_code === 422 || pending.error_code === 406) {
      this.securityMsg += ` ${this._i18n.transform('this-per')},
       ${this._i18n.transform('please-try-again')}
       ${this._i18n.transform('or-delete-request')}`;
    }
    setTimeout(() => {
      this.currentSecurity = pending;
    }, 10);
  }
  /**
   * send request to delete
   */
  public deleteRequest(): void {
    this.blockService.startModal(this.entryUserDelete, this.usersDelete);
    const model = {
      user: this.currentSecurity.user,
      process: this.currentSecurity.process,
      id: this.currentSecurity.cudrequest_id,
      action: 3
    };
    this.userService.removeGrant(model).subscribe(
      () => {
        this._alert.success(this._i18n.transform('success-delete-request'));
        this.blockService.stop(this.usersDelete);
        this.refreshData({ alert: '' });
      },
      error => {
        this.blockService.stop(this.usersDelete);
        this._alert.errorTitle('Error!', this._i18n.transform(error.error.status));
      }
    );
  }
  /**
   * Send again cud request
   */
  sendAgainRequest() {
    this.blockService.startModal(this.entrySecurity, this.securityList);
    const model = {
      user: this.currentSecurity.user,
      process: this.currentSecurity.process,
      id: this.currentSecurity.cudrequest_id,
      action: 1
    };
    this.userService.removeGrant(model).subscribe(
      () => {
        this.blockService.stop(this.securityList);
        this._alert.success(this._i18n.transform('edit-request-sent'));
        this.refreshData({ alert: '' });
      },
      error => {
        this.blockService.stop(this.securityList);
        this._alert.errorTitle('Error!', this._i18n.transform(error.error.status));
      }
    );
  }
  /**
   * get permission in progress
   * @param id permission id
   */
  getInProgressPermission(id: any): any[] {
    const current = [];
    this.grantPendings.forEach(item => {
      if (item.user === id) {
        current.push({
          process: item.process,
          error_code: item.error_code,
          cudrequest_id: item.cudrequest_id
        });
      }
    });
    return current;
  }
  /**
   * Get current permission
   * @param id id of permisison
   */
  getCurrentPermisions(id: number): number[] {
    let current = [];
    this.grantPendings.forEach(item => {
      if (item.user === id) {
        this.userGrantsPendings.push({
          process: item.process,
          error_code: item.error_code,
          cudrequest_id: item.cudrequest_id
        });
        current = item.current_process;
      }
    });
    return current;
  }
  /**
   * close modal
   */
  public closeModal(): void {
    this.userData = new UserModel();
    this.optionView = null;
    $('.modal').click();
  }
  /**
   * refresh data when an item is added or edited
   * @param data new items from users
   */
  public refreshData(data): void {
    this.users = [];
    this.usersPendings = [];
    this.userWithProcess = [];
    this.userData = new UserModel();
    this.closeModal();
    this.getUsers(this.uri);
    if (!this.isCudReq && data != null) {
      this.showNotification(data.alert);
    }
    this.isCudReq = false;
  }

  public refreshSecurity(data) {
    this.userWithProcess = [];
    this.blockService.startModal(this.entrySecurity, this.securityList);
    this.userService.getUsers(this.uri).subscribe(
      (result: any) => {
        if (result) {
          this.grantPendings = result.pending ? result.pending.filter(x => x.entity_name !== 'Users') : [];
          // this.users = result.data.data;
          result.data.data.forEach(item => {
            this.users.push(item);
          });
          this.getPermissions();
        }
        this.nextUrl = result.data.next_page_url;
        this.blockService.stop(this.userList);
      },
      error => {
        this.blockService.stop(this.userList);
        this._alert.showAlert(error.status, error.error.message || '');
      }
    );
  }
  /**
   * open modal to delete user
   * @param user to delete
   */
  public openDeleteUser(user, isCudReq = false): void {
    this.isCudReq = isCudReq;
    this.userData = user;
    if (isCudReq) {
      $('#deleteModal').click();
      this.userData.id = user.cudrequest_id;
    }
  }
  /**
   * delete user
   */
  public deleteUser(): void {
    this.disableButton = true;
    this.blockService.startModal(this.entryUserDelete, this.usersDelete);
    this.userService.deleteUser(this.userData.id).subscribe(
      () => {
        if (this.isCudReq) {
          this._alert.success(this._i18n.transform('success-delete-request'));
        } else {
          this._alert.success(this._i18n.transform('success-sent-delete-request'));
        }
        // this._alert.success(this._i18n.transform('success-deleted-user-msg'));
        this.blockService.stop(this.usersDelete);
        this.refreshData({ alert: 'delete' });
        this.disableButton = false;
      },
      error => {
        this._alert.error(error.message);
        this.blockService.stop(this.usersDelete);
        this.disableButton = false;
      }
    );
  }
  /**
   * show alert
   */
  showNotification(action) {
    let msg = '';
    switch (action) {
      case 'create':
        msg = `${this._i18n.transform('new-user-create')}, ${this._i18n.transform('silosys-verification')}`;
        break;
      case 'edit':
        msg = `${this._i18n.transform('edit-request-sent')}, ${this._i18n.transform('silosys-verification')}`;
        break;
      case 'delete':
        msg = `${this._i18n.transform('delete-request-sent')}, ${this._i18n.transform('silosys-verification')}`;
        break;
    }
    this._noty.create('info', 10000, msg);
  }
  /**
   * show error code
   * @param error error code
   */
  public showRequestInfo(error): void {
    this._alert.info(this._i18n.transform(error + 'msg'));
  }

  /**
   * find if record exist in pendings
   * @param idSeller id to find
   */
  public existInPending(idUser): boolean {
    const exist = this.usersPendings.find(x => x.id === idUser);
    return exist === undefined;
  }
  /**
   *  get current position scroll and get next page
   * @param event event div
   */
  public getNexPage(event): void {
    const pos = event.srcElement.scrollTop + event.srcElement.offsetHeight;
    const max = event.srcElement.scrollHeight;
    if (pos >= max) {
      if (this.nextUrl != null) {
        this.getUsers(this.nextUrl);
      }
    }
  }
}

