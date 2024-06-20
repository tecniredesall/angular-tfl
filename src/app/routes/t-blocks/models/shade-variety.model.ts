export interface IShadeVariety {
    blockId: string;
    shadeVarietyId: string;
    shadeVarietyName: string;
}

export class ShadeVarietyModel implements IShadeVariety {
    public blockId = null;
    public shadeVarietyId = null;
    public shadeVarietyName = null;

    constructor(item?: any) {
        if (item) {
            this.blockId = item.block_id ?? item.blockId ?? this.blockId;
            this.shadeVarietyId =
                item.shade_variety_id ??
                item.shadeVarietyId ??
                this.shadeVarietyId;
            this.shadeVarietyName =
                item.shade_variety_name ??
                item.shadeVarietyName ??
                this.shadeVarietyName;
        } else {
            Object.assign(this, {});
        }
    }
}
