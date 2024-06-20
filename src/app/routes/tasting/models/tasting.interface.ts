
export interface Labels {
    en: string;
    es: string;
}

export interface Placeholders {
    en: string;
    es: string;
}

export interface Option {
    id: string;
    labels: Labels;
}

export interface Extras {
    required: boolean;
    uri: string;
    catalog: string;
    is_catalog?: boolean;
    max?: number;
    min?: number;
    negative?: boolean;
    disabled?: boolean;
    options: Option[];
}

export interface Field {
    id: string;
    name: string;
    placeholders: Placeholders;
    labels: Labels;
    type: string;
    styles: string;
    order: number;
    extras: Extras;
}

export interface Section {
    name: string;
    order: number;
    labels: Labels;
    fields: Field[];
}