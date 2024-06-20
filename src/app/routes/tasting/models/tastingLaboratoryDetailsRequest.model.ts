export interface STTastingLaboratoryDetailsRequestModel {
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

export class TastingLaboratoryDetailsRequestModel implements STTastingLaboratoryDetailsRequestModel {
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
            const roast = { 'Parejo': 'equal', 'Disparejo': 'uneven', 'Otro': 'other' }

            this.performance = isAPIData ? item.performance : item.performance;
            this.humidity = isAPIData ? item.humidity : item.humidity;
            this.roast = roast[item.roast];
            this.damage = {
                "primary": item.damagePrimary,
                "secondary": item.damageSecondary
            }
            this.density = {
                dry_parchment: item.dry_parchment / 100,
                gold: item.gold / 100,
                cup: item.cup
            }
        } else {
            Object.assign({}, this);
        }

    }


}