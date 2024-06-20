import { reverseSortByKey } from "src/app/shared/utils/functions/sortFunction";
import { IKanbanDashboardLot, KanbanDashboardLot } from "./kanban-dashboard-lot.model";

export interface IKanbanDashboardProcess {
  id: string;
  name: string;
  numberLots: number;
  weightQQ: number;
  step: number;
  color: string;
  lots: IKanbanDashboardLot[];
  filteredLots: IKanbanDashboardLot[];
}

export class KanbanDashboardProcess implements IKanbanDashboardProcess {
  public id: string = null;
  public name: string = null;
  public numberLots: number = null;
  public weightQQ: number = null;
  public step: number = null;
  public color: string = '';
  public lots: IKanbanDashboardLot[] = [];
  public filteredLots: IKanbanDashboardLot[] = [];

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.process_id ?? this.id) : (item.id ?? this.id);
      this.name = item.name ?? this.name;
      this.numberLots = isAPIData ? (item.total_lotes ?? this.numberLots) : (item.numberLots ?? this.numberLots);
      this.weightQQ = isAPIData ? (item.total_qq ?? this.weightQQ) : (item.weightQQ ?? this.weightQQ);
      this.step = isAPIData ? (item.process_level ?? this.step) : (item.step ?? this.step);
      this.color = isAPIData ? (item.color_process ?? this.color) : (item.color ?? this.color);
      this.lots = isAPIData ?
        (
          item.lots ?
            item.lots.map((l: any) => new KanbanDashboardLot(l, true)) :
            this.lots
        ) :
        (item.lots ? [...item.lots] : this.lots);
        if (isAPIData && null == this.id) {
          this.step = -1;
          this.color = '#70889e';
        }
      this.filteredLots = isAPIData ? [...this.lots] : (item.filteredLots ? [...item.filteredLots] : this.filteredLots);
    }
    else {
      Object.assign(this, {});
    }
    this.lots = reverseSortByKey(this.lots, 'index');
    this.filteredLots = reverseSortByKey(this.filteredLots, 'index');
  }
}