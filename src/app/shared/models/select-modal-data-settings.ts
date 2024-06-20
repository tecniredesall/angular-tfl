export interface ISelectModalDataSettings {
    bindLabel: string;
    emptyImage: string;
    emptyLabel: string;
    isLoading: boolean;
    items: Array<any>
    placeholder: string;
    label: string;
    searchPlaceholder: string;
    isBlockItems: boolean;
    farmId?: number;
    groupBy?: string;
    groupByItems?: Array<any>;
    isEnableNewItem: boolean;
    permissionTag: string;
    addLabel: string;
}
