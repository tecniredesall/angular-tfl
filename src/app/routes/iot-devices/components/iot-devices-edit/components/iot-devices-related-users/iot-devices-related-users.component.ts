import { take, takeUntil } from 'rxjs/operators';
import { IotDevicesService } from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';

import {
    AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-iot-devices-related-users',
    templateUrl: './iot-devices-related-users.component.html',
    styleUrls: ['./iot-devices-related-users.component.scss'],
})
export class IotDevicesRelatedUsersComponent
    extends SubscriptionManagerDirective
    implements OnInit, AfterViewInit, OnDestroy {
    public userSearchInput = new UntypedFormControl('');
    public relatedUserSearchInput = new UntypedFormControl('');

    public availableUsers: Array<AppUser> = [];
    public selectedUsers: Array<AppUser> = [];
    public filteredAvailableUsers: Array<AppUser> = [];
    public filteredSelectedUsers: Array<AppUser> = [];

    @Input() selectedUsersID: number[] = [];
    @Output() selectedUsersChanged = new EventEmitter();

    constructor(private iotDevicesService: IotDevicesService) {
        super();
    }

    ngOnInit() {
        this.iotDevicesService
            .getIotDevicesUsers()
            .pipe(take(1))
            .subscribe((users) => {
                users.forEach((u) => {
                    if (this.selectedUsersID.indexOf(u.id) !== -1) {
                        this.selectedUsers = [...this.selectedUsers, u];
                    } else {
                        this.availableUsers = [...this.availableUsers, u];
                    }
                });
                this.filteredSelectedUsers = sortByStringValue(
                    this.selectedUsers,
                    'name'
                );
                this.filteredAvailableUsers = sortByStringValue(
                    this.availableUsers,
                    'name'
                );
            });
    }

    ngAfterViewInit() {
        this.userSearchInput.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                v = String(v).toLowerCase().trim();
                if (v) {
                    this.filteredAvailableUsers = this.availableUsers.filter(
                        (u) => u.getFullName().toLowerCase().includes(v)
                    );
                } else {
                    this.filteredAvailableUsers = sortByStringValue(
                        this.availableUsers,
                        'name'
                    );
                }
            });

        this.relatedUserSearchInput.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                v = String(v).toLowerCase().trim();
                if (v) {
                    this.filteredSelectedUsers = this.selectedUsers.filter(
                        (u) => u.getFullName().toLowerCase().includes(v)
                    );
                } else {
                    this.filteredSelectedUsers = sortByStringValue(
                        this.selectedUsers,
                        'name'
                    );
                }
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    public onUserClick(id: number) {
        this.selectedUsersID.push(id);
        this.selectedUsers.push(this.availableUsers.find((u) => u.id === id));
        this.availableUsers = this.availableUsers.filter((u) => u.id !== id);
        this.filteredSelectedUsers = sortByStringValue(
            this.selectedUsers,
            'name'
        );
        this.filteredAvailableUsers = sortByStringValue(
            this.availableUsers,
            'name'
        );
        this.selectedUsersChanged.emit(this.selectedUsersID);
    }

    public onUnlinkClick(id: number) {
        this.selectedUsersID = this.selectedUsersID.filter((v) => v !== id);
        this.availableUsers.push(this.selectedUsers.find((u) => u.id === id));
        this.selectedUsers = this.selectedUsers.filter((u) => u.id !== id);
        this.filteredSelectedUsers = sortByStringValue(
            this.selectedUsers,
            'name'
        );
        this.filteredAvailableUsers = sortByStringValue(
            this.availableUsers,
            'name'
        );
        this.selectedUsersChanged.emit(this.selectedUsersID);
    }

    public onClearRegisteredUsers() {
        this.relatedUserSearchInput.setValue('');
    }

    public onClearAvailableUsers() {
        this.userSearchInput.setValue('');
    }
}
