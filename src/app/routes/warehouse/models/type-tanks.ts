export interface TypeTank {
    id: number;
    name: string;
    slug: string;
    active: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export class TypeTankModel implements TypeTank {
    public id: number;
    public name: string;
    public slug: string;
    public active: number;
    public userId: number;
    public createdAt: string;
    public updatedAt: string;

    constructor(item: any) {
        if (item) {
            this.id = item.id ?? item.tankTypeId ?? this.id
            this.name = item.name ?? this.name
            this.slug = item.slug ?? this.slug
            this.active = item.active ?? this.active
            this.userId = item.user_id ?? this.userId
            this.createdAt = item.created_at ?? this.createdAt
            this.updatedAt = item.updated_at ?? this.updatedAt
        }
    }
}
