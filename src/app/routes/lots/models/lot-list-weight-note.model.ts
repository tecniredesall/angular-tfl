import * as moment from 'moment';
import { roundDecimal } from '../../../shared/utils/functions/accurate-decimal-operation';
import { ITRSealImage, TRSealImage } from '../../../shared/utils/models/seal-image.model';

export interface ILotListWeightNote {
    id: string;
    transactionInId: number;
    createdDate: moment.Moment;
    creatorUser: string;
    netWeightQQ: number;
    seals: Array<ITRSealImage>;
    sellerName: string;
    storageDate?: moment.Moment;
    productionTankId?: string;
    productionTankName?: string;
}

export class LotListWeightNote implements ILotListWeightNote {
    public id: string = null;
    public transactionInId: number = null;
    public createdDate: moment.Moment = null;
    public creatorUser: string = '';
    public netWeightQQ: number = null;
    public seals: Array<ITRSealImage> = [];
    public sellerName = '';
    public storageDate?: moment.Moment = null;
    public productionTankId?: string;
    public productionTankName?: string;

    constructor(
        data?: {
            item: any;
            config: {
                baseMeasurementUnitFactor: number;
                decimalPlaces: number;
            };
        },
        isAPIData: boolean = false
    ) {
        if (data) {
            this.id = isAPIData
                ? data.item.weight_note_id ?? this.id
                : data.item.uuid ?? this.id;
            this.transactionInId = isAPIData
                ? data.item.transaction_in_id ?? this.transactionInId
                : data.item.transactionInId ?? this.transactionInId;
            this.sellerName = isAPIData
                ? data.item.seller_name ?? this.sellerName
                : data.item.sellerName ?? this.sellerName;
            this.createdDate = isAPIData
                ? data.item.created_at ? moment(data.item.created_at, 'YYYY-MM-DD HH:mm:ss') : this.createdDate
                : data.item.createdDate ? moment(data.item.createdDate) : this.createdDate;
            this.storageDate = isAPIData
                ? data.item.storage_date ? moment(data.item.storage_date, 'YYYY-MM-DD HH:mm:ss') : this.storageDate
                : data.item.storageDate ? moment(data.item.storageDate) : this.storageDate;
            this.creatorUser = isAPIData
                ? data.item.created_name ?? this.creatorUser
                : data.item.creatorUser ?? this.creatorUser;
            if (isAPIData) {
                this.netWeightQQ = data.item.weight
                    ? roundDecimal(
                          data.item.weight *
                              data.config.baseMeasurementUnitFactor,
                          data.config.decimalPlaces
                      )
                    : this.netWeightQQ;
                this.seals = data.item.certifications
                    ? data.item.certifications.map(
                          (c: any) =>
                              new TRSealImage({
                                  id: c.certification_id,
                                  name: c.name,
                                  image: c.photo,
                              })
                      )
                    : this.seals;
                this.productionTankId = data.item.production_tank_id;
                this.productionTankName = data.item.tank_name;
            } else {
                this.netWeightQQ = data.item.netWeightQQ ?? this.netWeightQQ;
                this.seals = data.item.seals
                    ? [...data.item.seals]
                    : this.seals;
            }
        } else {
            Object.assign(this, {});
        }
    }
}
