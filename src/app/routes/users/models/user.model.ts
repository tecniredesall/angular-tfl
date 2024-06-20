import { PermissionModel } from './permission.model';

// tslint:disable: variable-name

export class UserModel {
    address: string;
    branch_id: number;
    city: string;
    email: string;
    id: number;
    lastname: string;
    mstatus: number;
    name: string;
    phone: string;
    securityArray: number[] = [];
    sigimagesize: number;
    source_id: string;
    state: string;
    status: number;
    permisos: PermissionModel[];
    password: string;
    optionUser: string;
    securityProcess: any;
}

export class SecurityPendingUser {
    user?: number;
    process?: number;
    grant?: string;
    error_code?: number;
    userData?: UserModel;
    cudrequest_id?: string;
    name?: string;
}
