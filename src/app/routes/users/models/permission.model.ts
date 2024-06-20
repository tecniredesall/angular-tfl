export class PermissionModel {
    $$hashKey: string;
    description: string;
    id: number;
    status: number;
}

export class PendingPermission {
    error_code: number;
    process: number;
    cudrequest_id?: string;
}
