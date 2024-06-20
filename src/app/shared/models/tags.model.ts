export interface ITag {
    title: string;
    type: TagType;
    property?: string;
    reference?: number | string;
}

export enum TagType {
    Value = 'value',
    Array = 'array',
    Object = 'Object',
    Selected = 'Selected',
    Users = 'users',
    CustomSelected = 'CustomSelected',
    DeleteItemFilterStatus ='deleteItemFilterStatus'
}
