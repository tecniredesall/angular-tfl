import { SealModel } from '../../../shared/utils/models/seal.model';

export interface ResponseSealsModel {
    status: boolean;
    message: string;
    data: Array<SealModel>;
}
