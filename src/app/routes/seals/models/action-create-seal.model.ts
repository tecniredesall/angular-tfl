import { SealActionTypeEnum } from "./seal-action-type.enum";

export interface ActionCreateSealModel {
  actionType: SealActionTypeEnum;
  sealId?: string;
}
