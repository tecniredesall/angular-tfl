export interface STTastingLaboratoryDetailsModel {
    performance: number,
    humidity: number,
    roast: string,
    damage: {
        primary: number,
        secondary: number
    },
    density: {
        dry_parchment: number,
        gold: number,
        cup: string
    }
}

export class TastingLaboratoryDetailsModel implements STTastingLaboratoryDetailsModel {
    public performance: number = null;
    public humidity: number = null;
    public roast: string = null;
    public damage: {
        primary: number,
        secondary: number
    } = {
            primary: null,
            secondary: null
        };
    public density: {
        dry_parchment: number,
        gold: number,
        cup: string
    } = {
            dry_parchment: null,
            gold: null,
            cup: null
        }

    constructor(item?: any, isAPIData: boolean = false) {
        if (item) {
            this.performance = isAPIData ? item.performance : item.performance;
            this.humidity = isAPIData ? item.humidity : item.humidity;
            this.roast = isAPIData ? item.roast : item.roast;
            this.damage = isAPIData ? item.damage : item.damage;
            this.density = isAPIData ? item.density : item.density;
        } else {
            Object.assign({}, this);
        }

    }


}