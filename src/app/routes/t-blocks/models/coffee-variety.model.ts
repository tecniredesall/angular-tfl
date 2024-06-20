export interface ICoffeeVariety {
    blockId: string;
    coffeeVarietyId: string;
    coffeeVarietyName: string;
}

export class CoffeeVarietyModel implements ICoffeeVariety {
    public blockId = null;
    public coffeeVarietyId = null;
    public coffeeVarietyName = null;

    constructor(item?: any) {
        if (item) {
            this.blockId = item.block_id ?? item.blockId ?? this.blockId;
            this.coffeeVarietyId = item.variety_coffee_id ?? item.coffeeVarietyId ?? this.coffeeVarietyId;
            this.coffeeVarietyName = item.variety_coffee_name ?? item.coffeeVarietyName ?? this.coffeeVarietyName;
        } else {
            Object.assign(this, {});
        }
    }
}