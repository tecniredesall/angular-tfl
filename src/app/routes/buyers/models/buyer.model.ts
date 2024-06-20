export interface TIBuyerModel {
    id: number;
    companyName: string;
    companyRtn: string;
    legalName: string;
    legalLastname: string;
    legalDocumentType: string;
    legalIdentity: string;
    legalBirthday: string;
    legalEmail: string;
    legalPhone: string;
    legalAddress: string,
    shippingTickets: string;
    fullLegalName: string;
}


export class BuyerModel implements TIBuyerModel {

    id: number = 0;
    companyName: string = '';
    companyRtn: string = '';
    legalName: string = '';
    legalLastname: string = '';
    legalDocumentType: string = '';
    legalIdentity: string = '';
    legalBirthday: string = '';
    legalEmail: string = '';
    legalPhone: string = '';
    legalAddress: string = '';
    shippingTickets: string = '';
    fullLegalName: string = '';
    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.companyName = item.company_name ?? this.companyName;
            this.companyRtn = item.company_rtn ?? this.companyRtn;
            this.legalName = item.legal_name ?? this.legalName;
            this.legalLastname = item.legal_lastname ?? this.legalLastname;
            this.legalDocumentType = item.legal_document_type ?? this.legalDocumentType;
            this.legalIdentity = item.legal_identity ?? this.legalIdentity;
            this.legalBirthday = item.legal_birthday ?? this.legalBirthday;
            this.legalEmail = item.legal_email ?? this.legalEmail;
            this.legalPhone = item.legal_phone ?? this.legalPhone;
            this.legalAddress = item.legal_address ?? this.legalAddress;
            this.shippingTickets = item.shipping_tickets ?? this.shippingTickets;
            this.fullLegalName = `${this.legalName} ${this.legalLastname} `
        }
    }

}
