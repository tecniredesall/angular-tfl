
export interface STTastingSensoryAnalysisModel {
    fragance: number,
    taste: number,
    acidity: number,
    body: number,
    taste_mouth: number,
    balance: number,
    general: number,
    uniformity: number,
    clean_cup: number,
    sweetness: number,
    defects: number,
    publicBalance: number
}

export class TastingSensoryAnalysisModel implements STTastingSensoryAnalysisModel {
    public fragance: number = null;
    public taste: number = null;
    public acidity: number = null;
    public body: number = null;
    public taste_mouth: number = null;
    public balance: number = null;
    public general: number = null;
    public uniformity: number = null;
    public clean_cup: number = null;
    public sweetness: number = null;
    public defects: number = null;
    public publicBalance: number = null;


    constructor(item?: any, isAPIData: boolean = false) {
        if (item) {
            this.fragance = isAPIData ? item.fragance : item.fragance;
            this.taste = isAPIData ? item.taste : item.taste;
            this.acidity = isAPIData ? item.acidity : item.acidity;
            this.body = isAPIData ? item.body : item.body;
            this.taste_mouth = isAPIData ? item.taste_mouth : item.taste_mouth;
            this.balance = isAPIData ? item.balance : item.balance;
            this.general = isAPIData ? item.general : item.general;
            this.uniformity = isAPIData ? item.uniformity : item.uniformity;
            this.clean_cup = isAPIData ? item.clean_cup : item.clean_cup;
            this.sweetness = isAPIData ? item.sweetness : item.sweetness;
            this.defects = isAPIData ? item.defects : item.defects;
            this.publicBalance = isAPIData ? item.publicBalance : item.publicBalance;
        } else {
            Object.assign({}, this);
        }
    }

}