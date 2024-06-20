export interface ITRDialogSettings {
    title: string;
    message?: string;
    withReason?: boolean;
    okButton?: ICustomButtonDialogSettings;
    reason?:IReasonDialogSettings;
    onlyMessage?:string;
}

export interface ICustomButtonDialogSettings {
    class?: string;
    label?: string;
}

export interface IReasonDialogSettings {
    title?: string;
    placeholder?: string;
}

