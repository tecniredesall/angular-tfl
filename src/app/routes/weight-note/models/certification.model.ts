export class CertificationModel {
    name: string;
    id: string;
    image: any;
    userId?: any;

    constructor(item: any) {
        this.id = item.certification_id;
        this.name = item.name;
        this.image = item.image;
    }
}
