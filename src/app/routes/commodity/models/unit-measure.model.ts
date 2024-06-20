import { DefaultUnitMeasure } from './default-unit-measure.model';
import * as moment from 'moment-timezone';
import { UnitConvertion } from './unit-convertion.model';

export interface IUnitMeasureModel {
    abbreviation: string;
    name: string;
    defaultUnit: DefaultUnitMeasure;
    isEnabled: boolean;
    measurementTypeId: number;
    measurementUnitId: string;
    storageDate: moment.Moment;
    unitsConverter:Array<UnitConvertion>;
    userId: number;

}

//
export class UnitMeasureModel implements IUnitMeasureModel {
    public abbreviation: string = '';
    public name: string = '';
    public defaultUnit: DefaultUnitMeasure = null;
    public isEnabled: boolean = false;
    public measurementTypeId: number = 0;
    public measurementUnitId: string = '';
    public storageDate: moment.Moment;
    public unitsConverter:Array<UnitConvertion>= [];
    public userId: number = 0;

    constructor(item: any) {
        if (item) {
            this.abbreviation = item.abbreviation ?? this.abbreviation;
            this.name = item.name ?? this.name;
            this.defaultUnit = item.default_unit ? new DefaultUnitMeasure(item.default_unit) : this.defaultUnit;
            this.isEnabled = item.is_enabled ?? this.isEnabled;
            this.measurementTypeId = item.measurement_type_id ?? this.measurementTypeId;
            this.measurementUnitId = item.measurement_unit_id ?? this.measurementTypeId;
            this.storageDate = item.storage_date ? moment(item.storage_date, 'YYYY-MM-DD HH:mm:ss') : this.storageDate;
            this.userId = item.user_id ?? this.userId;
            this.unitsConverter = item.units_converter ? item.units_converter.map((x)=>  new UnitConvertion(x)) : this.unitsConverter
        }
    }

}
