export interface IAppUser {
    id: number;
    name: string;
    lastname: string;
    email: string;
}
export class AppUser implements IAppUser {
    public id: number;
    public name: string;
    public lastname: string;
    public email: string;

    constructor(data?: any) {
        if (data) {
            this.id = data.id ?? null;
            this.name = data.name ?? null;
            this.lastname = data.lastname ?? null;
            this.email = data.email ?? null;
        }
    }

    public getFullName() {
        return `${this.name} ${this.lastname}`;
    }
}
