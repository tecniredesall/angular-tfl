import { takeUntil } from 'rxjs/operators';
import {
    ContractTrumodityModel
} from 'src/app/routes/purchase-orders/models/contract-trumodity.model';
import { PurchaseOrderModel } from 'src/app/routes/purchase-orders/models/purchase-order.model';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    reverseSortByKey, sortBykey, sortByStringValue
} from 'src/app/shared/utils/functions/sortFunction';

import {
    AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';


@Component({
    selector: 'app-purchase-order-contracts',
    templateUrl: './purchase-order-contracts.component.html',
    styleUrls: ['./purchase-order-contracts.component.scss'],
})
export class PurchaseOrderContractsComponent
    extends SubscriptionManagerDirective
    implements OnInit, AfterViewInit, OnDestroy
{
    public searchInput = new UntypedFormControl('');
    public filteredContracts: ContractTrumodityModel[];
    @Input() order: PurchaseOrderModel;
    @Input() config: ITRConfiguration;
    @Input() contracts: ContractTrumodityModel[];
    @Input() producer: TProducerModel;
    @Output() contractChanged = new EventEmitter();
    @Output() editCharacteristics = new EventEmitter();
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    @Input() selectedContract: ContractTrumodityModel;
    public columnAscState = {
        creation: true,
        id: false,
    };
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS.PURCHASE_ORDER;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    constructor() {
        super();
    }

    ngOnInit() {}
    ngAfterViewInit() {
        this.searchInput.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                if (v) {
                    this.filteredContracts = this.contracts.filter((c) =>
                        c.id.toLocaleLowerCase().includes(v.toLocaleLowerCase())
                    );
                } else {
                    this.filteredContracts = this.contracts;
                }
            });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.contracts) {
            this.contracts = changes.contracts.currentValue;
            this.filteredContracts = this.contracts;
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }

    public sortData(key: string) {
        switch (key) {
            case 'id':
                this.columnAscState.id = !this.columnAscState.id;
                this.contracts = sortByStringValue(
                    this.contracts,
                    'id',
                    this.columnAscState.id
                );
                break;
            case 'creation':
                this.columnAscState.creation = !this.columnAscState.creation;
                this.contracts = this.columnAscState.creation
                    ? sortBykey(this.contracts, 'creationDate')
                    : reverseSortByKey(this.contracts, 'creationDate');
                break;
            default:
                break;
        }
    }

    public onActionClicked(action: number, contract?: ContractTrumodityModel) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.editCharacteristics.emit(contract);
                break;
            default:
                break;
        }
    }

    public onContractSelected(contract: ContractTrumodityModel) {
        this.contractChanged.emit(contract);
    }

    public onClearSearchInput() {
        this.searchInput.setValue('');
    }
}
