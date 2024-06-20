export interface ISoilType {
    blockId: string;
    soilTypeId: string;
    soilTypeName: string;
}

export class SoilTypeModel implements ISoilType {
    public blockId = null;
    public soilTypeId = null;
    public soilTypeName = null;

    constructor(item?: any) {
        if (item) {
            this.blockId = item.block_id ?? item.blockId ?? this.blockId;
            this.soilTypeId = item.soil_type_id ?? item.soilTypeId ?? this.soilTypeId;
            this.soilTypeName = item.soil_type_name ?? item.soilTypeName ?? this.soilTypeName;
        } else {
            Object.assign(this, {});
        }
    }
}