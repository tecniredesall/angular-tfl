import { sortBykey } from "src/app/shared/utils/functions/sortFunction";
import { IKanbanDashboardProcess, KanbanDashboardProcess } from "./kanban-dashboard-process.model";

export interface IKanbanDashboardWorkflow {
  id: string;
  name: string;
  productionTypeId: string;
  productionTypeName: string;
  processes: IKanbanDashboardProcess[];
}

export class KanbanDashboardWorkflow implements IKanbanDashboardWorkflow {
  public id: string = null;
  public name: string = null;
  public productionTypeId: string = null;
  public productionTypeName: string = null;
  public processes: IKanbanDashboardProcess[] = [];

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.workflow_id ?? this.id) : (item.id ?? this.id);
      this.name = isAPIData ? (item.workflow_name ?? this.name) : (item.name ?? this.name);
      this.productionTypeId = isAPIData ? (item.production_type_id ?? this.productionTypeId) : (item.productionTypeId ?? this.productionTypeId);
      this.productionTypeName = isAPIData ? (item.production_type_name ?? this.productionTypeName) : (item.productionTypeName ?? this.productionTypeName);
      this.processes = isAPIData ?
        (
          item.processes ?
            item.processes.map((p: any) => new KanbanDashboardProcess(p, true)) :
            this.processes
        ) :
        (item.processes ? [...item.processes] : this.processes);
    }
    else {
      Object.assign(this, {});
    }
    this.processes = sortBykey(this.processes, 'step');
  }
}