import { Injectable } from '@angular/core';

import { CONSTANTS } from '../../utils/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    private permissions: Array<any> = [];
    constructor() {}

    public checkValidity(tag: string, type: string): boolean {
        this.permissions = localStorage.getItem('token-data') ? JSON.parse(
            localStorage.getItem('token-data')
        ).permissions : [];
        let allowAll = this.permissions.find(
            (p) => p.tag == CONSTANTS.PERMISSIONS.ALL
        );
        if (allowAll) {
            return true;
        }
        let permission = this.permissions.find((p) => p.tag == tag );
        return tag && permission &&  permission.permission[type] ;
    }

    public checkForEmptyPermissions(tag: string) {
        let hasEmptyPermissions = true;
        Object.keys(CONSTANTS.PERMISSION_TYPES).every((k) => {
            if (this.checkValidity(tag, CONSTANTS.PERMISSION_TYPES[k])) {
                hasEmptyPermissions = false;
                return false;
            }
        });
        return hasEmptyPermissions;
    }

    public checkForOnlyRead(tag: string) {
        const hasTagPermission = this.permissions.find(
            (p) => p.tag === tag
        );
        const permissions = hasTagPermission ? hasTagPermission.permission : {};
        return (
            this.checkValidity(tag, CONSTANTS.PERMISSION_TYPES.READ) &&
            Object.keys(permissions).length === 1
        );
    }
}
