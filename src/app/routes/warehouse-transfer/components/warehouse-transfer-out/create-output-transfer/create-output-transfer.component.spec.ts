import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutputTransferComponent } from './create-output-transfer.component';

describe('CreateOutputTransferComponent', () => {
  let component: CreateOutputTransferComponent;
  let fixture: ComponentFixture<CreateOutputTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOutputTransferComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOutputTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disableSaveExit', async () => {
    component.shippingTicket = component.shippingTicket;
    component.shippingTicket.generalInformation = {
      invalid: true,
      pending: true
    };
    component.shippingTicket.weightCapture = {
      invalid: {},
      pending: {}
    };
    component.shippingTicket.driverInformation = {
      invalid: {},
      pending: {}
    };
    const disableSaveExit = component.disableSaveExit;

  });


  it('ngOnInit()', async () => {
    spyOn['_getConfiguration']();
    spyOn['_getCompanyInfo']();
    spyOn['_disabledSections']();
    component.ngOnInit();
    expect(component['_getConfiguration']).toHaveBeenCalled();
    expect(component['_getCompanyInfo']).toHaveBeenCalled();
    expect(component['_disabledSections']).toHaveBeenCalled();
  });


  it('private _thenCompanyInfo()', async () => {
    component['openSection']();
    component['_getShippingTicket']();
    component['_createShippingTickerForm']();
    component['_getDrivers']()
    component['_getVehicles']()
    component['_getConfiguration']()
    component['_getReasonTransfer']()
    component['_getBuyers']()
    component['_getScales']()
    component.['_thenCompanyInfo']();
    expect(component.openSection).toHaveBeenCalled();
    expect(component['_getShippingTicket']).toHaveBeenCalled();
    expect(component['_createShippingTickerForm']).toHaveBeenCalled();
    expect(component['_getDrivers']).toHaveBeenCalled();
    expect(component['_getVehicles']).toHaveBeenCalled();
    expect(component['_getConfiguration']).toHaveBeenCalled();
    expect(component['_getReasonTransfer']).toHaveBeenCalled();
    expect(component['_getBuyers']).toHaveBeenCalled();
    expect(component['_getScales']).toHaveBeenCalled();
  });


  it('on openSection()', async () => {
    component.sections = component.sections || {};
    component.sections.item = {
      open: {},
      disabled: {}
    };
    component.openSection();

  });


  it('overrideWarehouse()', async () => {
    component._dialog = component._dialog || {};
    spyOn(component['_dialog'], 'open');
    component.overrideWarehouse();
    expect(component['_dialog'].open).toHaveBeenCalled();
  });


  it('_isEmptyLoadAllowed()', async () => {
    spyOn(component['_getConfigurationOfCompanyByName']).and.returnValue({
      value: {}
    });
    component._isEmptyLoadAllowed();
    expect(component['_getConfigurationOfCompanyByName']).toHaveBeenCalled();
  });


  it('_getValidatorForLoads()', async () => {
    spyOn(component['_isEmptyLoadAllowed']());
    component['_getValidatorForLoads']();
    expect(component['_isEmptyLoadAllowed']).toHaveBeenCalled();
  });


  it('private _getCompanyInfo()', async () => {
    spyOn(component, 'selectMovementInDialog');
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCompanyInfo').and.returnValue(observableOf({
      data: {}
    }));
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    spyOn(component, '_thenCompanyInfo');
    component._getCompanyInfo();
    expect(component.selectMovementInDialog).toHaveBeenCalled();
    expect(component._shippingTicketService.getCompanyInfo).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component._thenCompanyInfo).toHaveBeenCalled();
  });


  it('_disabledSections()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      disable: function () { }
    };
    component.shippingTicket.driverInformation = {
      disable: function () { }
    };
    component.shippingTicket.weightCapture = {
      controls: [{}]
    };
    component._disabledSections();

  });


  it('_getShippingTicket()', async () => {
    component._WarehouseTransferService = component._WarehouseTransferService || {};
    spyOn(component._WarehouseTransferService, 'getMovementByID').and.returnValue(observableOf({}));
    component.weights = component.weights || {};
    spyOn(component.weights, 'push');
    spyOn(component, '_createInformationFormGroup');
    spyOn(component, '_createDriverInformationFormGroup');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      push: function () { },
      at: function () {
        return {
          get: function () {
            return {
              controls: [{}, {}]
            };
          }
        };
      },
      valueChanges: observableOf({})
    };
    component.shippingTicket.generalInformation = {
      valueChanges: {}
    };
    component.shippingTicket.driverInformation = {
      valueChanges: {}
    };
    spyOn(component, '_createWeightCaptureFormGroup');
    spyOn(component, '_getCommodities');
    spyOn(component, 'setCommodity');
    spyOn(component, '_getWarehouses');
    component.sections = component.sections || {};
    component.sections.generalInformation = {
      disabled: {}
    };
    component.sections.weightCapture = {
      disabled: {}
    };
    component.sections.driverInformation = {
      disabled: {}
    };
    spyOn(component, 'setCompanyBranch');
    component.buyersLocationPaginator = component.buyersLocationPaginator || {};
    component.buyersLocationPaginator.initialItems = 'initialItems';
    component.buyersLocationPaginator.isLoading = 'isLoading';
    spyOn(component, '_getBuyerLocation');
    spyOn(component, '_setInitialItem');
    component.buyersPaginator = component.buyersPaginator || {};
    component.buyersPaginator.initialItems = 'initialItems';
    component.driversPaginator = component.driversPaginator || {};
    component.driversPaginator.initialItems = 'initialItems';
    component.vehiclesPaginator = component.vehiclesPaginator || {};
    component.vehiclesPaginator.initialItems = 'initialItems';
    spyOn(component, '_getDrivers');
    spyOn(component, '_getVehicles');
    spyOn(component, '_getTransportCompanies');
    spyOn(component, '_checkIfDataWasModified');
    spyOn(component, '_getWareHouse');
    spyOn(component, '_getCompanyBranches');
    component.disabled$ = component.disabled$ || {};
    spyOn(component.disabled$, 'next');
    component._getShippingTicket();

    expect(component._WarehouseTransferService.getMovementByID).toHaveBeenCalled();
    expect(component.weights.push).toHaveBeenCalled();
    expect(component._createInformationFormGroup).toHaveBeenCalled();
    expect(component._createDriverInformationFormGroup).toHaveBeenCalled();
    expect(component._createWeightCaptureFormGroup).toHaveBeenCalled();
    expect(component._getCommodities).toHaveBeenCalled();
    expect(component.setCommodity).toHaveBeenCalled();
    expect(component._getWarehouses).toHaveBeenCalled();
    expect(component.setCompanyBranch).toHaveBeenCalled();
    expect(component._getBuyerLocation).toHaveBeenCalled();
    expect(component._setInitialItem).toHaveBeenCalled();
    expect(component._getDrivers).toHaveBeenCalled();
    expect(component._getVehicles).toHaveBeenCalled();
    expect(component._getTransportCompanies).toHaveBeenCalled();
    expect(component._checkIfDataWasModified).toHaveBeenCalled();
    expect(component._getWareHouse).toHaveBeenCalled();
    expect(component._getCompanyBranches).toHaveBeenCalled();
    expect(component.disabled$.next).toHaveBeenCalled();
  });


  it('disabledweightCaptureClosed()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              disable: function () { }
            };
          },
          disable: function () { }
        };
      }
    };
    component._disabledweightCaptureClosed({});

  });


  it('_checkIfDataWasModified()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () { }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._checkIfDataWasModified();

  });


  it('_setExistCharacteristic()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              controls: [{}]
            };
          }
        };
      }
    };
    component.characteristics = component.characteristics || {};
    spyOn(component.characteristics, 'findIndex').and.returnValue([
      {
        "deduction": {
          "id": {}
        }
      }
    ]);
    component.characteristics.characteristicIndex = 'characteristicIndex';
    component._setExistCharacteristic({});
    expect(component.characteristics.findIndex).toHaveBeenCalled();
  });


  it('_createShippingTickerForm()', async () => {
    spyOn(component, '_createWeightCaptureFormGroup');
    spyOn(component, '_createInformationFormGroup');
    spyOn(component, '_createDriverInformationFormGroup');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { }
        };
      }
    };
    spyOn(component, '_getCommodities');
    spyOn(component, '_getCompanyBranches');
    component._createShippingTickerForm();
    expect(component._createWeightCaptureFormGroup).toHaveBeenCalled();
    expect(component._createInformationFormGroup).toHaveBeenCalled();
    expect(component._createDriverInformationFormGroup).toHaveBeenCalled();
    expect(component._getCommodities).toHaveBeenCalled();
    expect(component._getCompanyBranches).toHaveBeenCalled();
  });


  it('_createInformationFormGroup()', async () => {

    component._createInformationFormGroup({
      generalInformation: {
        id: {},
        ticketDate: {},
        folio: {},
        buyerId: {},
        companyBranchId: {},
        companyBranchPointId: {},
        buyerLocationId: {},
        reasonTransferId: {},
        close: {}
      }
    });

  });


  it('_createWeightCaptureFormGroup()', async () => {
    spyOn(component, '_createWeightFormGroup');
    spyOn(component, '_createPenaltyFormGroup');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          setControl: function () { }
        };
      }
    };
    component._createWeightCaptureFormGroup({
      weightCapture: {
        index: {
          weights: [{}],
          penalties: [{}],
          shippingNoteId: {},
          commodityId: {},
          commodityTypeId: {},
          commodityTransformationId: {},
          commodityTransformationName: {},
          warehouseId: {},
          totalSacks: {},
          totalGross: {},
          totalGrossQQ: {},
          totalTare: {},
          totalTareQQ: {},
          totalDiscount: {},
          totalDiscountQQ: {},
          totalAddition: {},
          totalAdditionQQ: {},
          totalNet: {},
          totalNetQQRow: {},
          totalNetQQ: {},
          totalNetDryWt: {},
          totalNetDryWtQQ: {},
          totalCharacteristics: {},
          totalCharacteristicsPercent: {},
          status: {},
          isDataLoadedOnEdit: {},
          isWarningContainer: {},
          textNote: {},
          close: {},
          noteDescription: {},
          noteFolio: {},
          wareHouseType: {}
        }
      }
    });
    expect(component._createWeightFormGroup).toHaveBeenCalled();
    expect(component._createPenaltyFormGroup).toHaveBeenCalled();
  });


  it('_createDriverInformationFormGroup()', async () => {

    component._createDriverInformationFormGroup({
      driverInformation: {
        driverId: {},
        driverIdentity: {},
        vehicleId: {},
        vehicleType: {},
        transportCompanyId: {},
        vehicleLicense: {}
      }
    });

  });


  it('_createWeightFormGroup()', async () => {
    spyOn(component, '_getDefaultSacksValue');
    spyOn(component, '_getValidatorForLoads');
    spyOn(component, '_getDefaultTareValue');
    component._createWeightFormGroup({
      sacksNumber: {},
      grossWeight: {},
      tare: {},
      featuredWeight: {},
      index: {},
      isWarningSacks: {},
      netWeightQQ: {}
    });
    expect(component._getDefaultSacksValue).toHaveBeenCalled();
    expect(component._getValidatorForLoads).toHaveBeenCalled();
    expect(component._getDefaultTareValue).toHaveBeenCalled();
  });


  it('_createPenaltyFormGroup()', async () => {

    component._createPenaltyFormGroup({
      characteristic: {},
      characteristicsEnabled: {},
      choiceDeduction: {},
      sign: {},
      value: {},
      total: {}
    });

  });


  it('_getConfiguration()', async () => {
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component._purchaseOrderService = component._purchaseOrderService || {};
    spyOn(component._purchaseOrderService, 'getConfiguration').and.returnValue(observableOf({}));
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getConfiguration();
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._purchaseOrderService.getConfiguration).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getReasonTransfer()', async () => {
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getReasonTransfer').and.returnValue(observableOf({}));
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getReasonTransfer();
    expect(component._shippingTicketService.getReasonTransfer).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getCompanyBranches()', async () => {
    component.companyBranchesPaginator = component.companyBranchesPaginator || {};
    component.companyBranchesPaginator.isLoading = 'isLoading';
    component.companyBranchesPaginator.searchTerm = 'searchTerm';
    component.companyBranchesPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.companyBranchesPaginator.items = {
      0: {
        id: {}
      },
      length: {}
    };
    component.companyBranchesPaginator.paginator = 'paginator';
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCompanyBranches').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      get: function () {
        return {
          value: {}
        };
      },
      patchValue: function () { }
    };
    spyOn(component, 'setCompanyBranch');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getCompanyBranches({});
    expect(component._shippingTicketService.getCompanyBranches).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component.setCompanyBranch).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getCompanyBranchesPoint()', async () => {
    component.companyBranchesPointPaginator = component.companyBranchesPointPaginator || {};
    component.companyBranchesPointPaginator.isLoading = 'isLoading';
    component.companyBranchesPointPaginator.items = {
      0: {
        id: {}
      },
      length: {}
    };
    component.companyBranchesPointPaginator.searchTerm = 'searchTerm';
    component.companyBranchesPointPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.companyBranchesPointPaginator.paginator = 'paginator';
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      get: function () {
        return {
          enable: function () { },
          value: {}
        };
      },
      patchValue: function () { }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCompanyBranchesPoints').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getCompanyBranchesPoint({});
    expect(component._shippingTicketService.getCompanyBranchesPoints).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getBuyers()', async () => {
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getBuyers').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component.buyersPaginator = component.buyersPaginator || {};
    component.buyersPaginator.searchTerm = 'searchTerm';
    component.buyersPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.buyersPaginator.items = 'items';
    component.buyersPaginator.paginator = 'paginator';
    component.buyersPaginator.isLoading = 'isLoading';
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getBuyers({});
    expect(component._shippingTicketService.getBuyers).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getBuyerLocation()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      get: function () {
        return {
          enable: function () { },
          value: {}
        };
      }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getBuyerLocation').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component.buyersLocationPaginator = component.buyersLocationPaginator || {};
    component.buyersLocationPaginator.searchTerm = 'searchTerm';
    component.buyersLocationPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.buyersLocationPaginator.items = 'items';
    component.buyersLocationPaginator.paginator = 'paginator';
    component.buyersLocationPaginator.isLoading = 'isLoading';
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getBuyerLocation({});
    expect(component._shippingTicketService.getBuyerLocation).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getCommodities()', async () => {
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCommodities').and.returnValue(observableOf({}));
    component.commodities = component.commodities || {};
    component.commodities.0 = {
      id: {}
    };
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { }
        };
      }
    };
    spyOn(component, 'setCommodity');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getCommodities({});
    expect(component._shippingTicketService.getCommodities).toHaveBeenCalled();
    expect(component.setCommodity).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getCommodityTypes()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCommodityTypes').and.returnValue(observableOf({}));
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getCommodityTypes({});
    expect(component._shippingTicketService.getCommodityTypes).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getWarehouses()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getWarehouses').and.returnValue(observableOf({}));
    component.warehouses = component.warehouses || {};
    component.warehouses.index = 'index';
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getWarehouses({});
    expect(component._shippingTicketService.getWarehouses).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getCharacteristics()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getCharacteristics').and.returnValue(observableOf({}));
    spyOn(component, '_setExistCharacteristic');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getCharacteristics({});
    expect(component._shippingTicketService.getCharacteristics).toHaveBeenCalled();
    expect(component._setExistCharacteristic).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getDrivers()', async () => {
    component.driversPaginator = component.driversPaginator || {};
    component.driversPaginator.isLoading = 'isLoading';
    component.driversPaginator.searchTerm = 'searchTerm';
    component.driversPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.driversPaginator.items = [
      {
        "id": {}
      },
      null
    ];
    component.driversPaginator.paginator = 'paginator';
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getDrivers').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getDrivers({});
    expect(component._shippingTicketService.getDrivers).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getWareHouse()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component._WarehouseTransferService = component._WarehouseTransferService || {};
    spyOn(component._WarehouseTransferService, 'getWareHouse').and.returnValue(observableOf({}));
    spyOn(component, '_disabledSections');
    component._getWareHouse({});
    expect(component._WarehouseTransferService.getWareHouse).toHaveBeenCalled();
    expect(component._disabledSections).toHaveBeenCalled();
  });


  it('_getVehicles()', async () => {
    component.vehiclesPaginator = component.vehiclesPaginator || {};
    component.vehiclesPaginator.isLoading = 'isLoading';
    component.vehiclesPaginator.searchTerm = 'searchTerm';
    component.vehiclesPaginator.initialItems = {
      length: {},
      concat: function () { }
    };
    component.vehiclesPaginator.items = [
      {
        "truckId": {}
      },
      null
    ];
    component.vehiclesPaginator.paginator = 'paginator';
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'getTrucks').and.returnValue(observableOf({
      items: {},
      paginator: {}
    }));
    spyOn(component, '_getParams');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getVehicles({});
    expect(component._shippingTicketService.getTrucks).toHaveBeenCalled();
    expect(component._getParams).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getParams()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      get: function () {
        return {
          value: {}
        };
      }
    };
    component._getParams({});

  });


  it('formWeightCaptureReady()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          setControl: function () { }
        };
      }
    };
    spyOn(component, 'calculateWeightTotals');
    spyOn(component, 'recalculateCharacteristicsValues');
    component.formWeightCaptureReady({
      get: function () {
        return {
          valueChanges: observableOf({})
        };
      }
    }, {});
    expect(component.calculateWeightTotals).toHaveBeenCalled();
    expect(component.recalculateCharacteristicsValues).toHaveBeenCalled();
  });


  it('onCompanyBranchScrollToEnd()', async () => {
    component.companyBranchesPaginator = component.companyBranchesPaginator || {};
    component.companyBranchesPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getCompanyBranches');
    component.onCompanyBranchScrollToEnd();
    expect(component._getCompanyBranches).toHaveBeenCalled();
  });


  it('onCompanyBranchPointScrollToEnd()', async () => {
    component.companyBranchesPointPaginator = component.companyBranchesPointPaginator || {};
    component.companyBranchesPointPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getCompanyBranchesPoint');
    component.onCompanyBranchPointScrollToEnd();
    expect(component._getCompanyBranchesPoint).toHaveBeenCalled();
  });


  it('onBuyersScrollToEnd()', async () => {
    component.buyersPaginator = component.buyersPaginator || {};
    component.buyersPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getBuyers');
    component.onBuyersScrollToEnd();
    expect(component._getBuyers).toHaveBeenCalled();
  });


  it('onBuyersLocationsScrollToEnd()', async () => {
    component.buyersLocationPaginator = component.buyersLocationPaginator || {};
    component.buyersLocationPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getBuyerLocation');
    component.onBuyersLocationsScrollToEnd();
    expect(component._getBuyerLocation).toHaveBeenCalled();
  });


  it('onDriverScrollToEnd()', async () => {
    component.driversPaginator = component.driversPaginator || {};
    component.driversPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getDrivers');
    component.onDriverScrollToEnd();
    expect(component._getDrivers).toHaveBeenCalled();
  });


  it('onVehicleScrollToEnd()', async () => {
    component.vehiclesPaginator = component.vehiclesPaginator || {};
    component.vehiclesPaginator.paginator = {
      nextPageUrl: {}
    };
    spyOn(component, '_getVehicles');
    component.onVehicleScrollToEnd();
    expect(component._getVehicles).toHaveBeenCalled();
  });


  it('onSearchCompanyBranch()', async () => {
    component.companyBranchesPaginator = component.companyBranchesPaginator || {};
    component.companyBranchesPaginator.initialItems = 'initialItems';
    component.companyBranchesPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getCompanyBranches');
    component.onSearchCompanyBranch({});
    expect(component._getCompanyBranches).toHaveBeenCalled();
  });


  it('onSearchCompanyBranchPoint()', async () => {
    component.companyBranchesPointPaginator = component.companyBranchesPointPaginator || {};
    component.companyBranchesPointPaginator.initialItems = 'initialItems';
    component.companyBranchesPointPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getCompanyBranchesPoint');
    component.onSearchCompanyBranchPoint({});
    expect(component._getCompanyBranchesPoint).toHaveBeenCalled();
  });


  it('onSearchBuyers()', async () => {
    component.buyersPaginator = component.buyersPaginator || {};
    component.buyersPaginator.initialItems = 'initialItems';
    component.buyersPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getBuyers');
    component.onSearchBuyers({});
    expect(component._getBuyers).toHaveBeenCalled();
  });


  it('onSearchBuyerLocation()', async () => {
    component.buyersLocationPaginator = component.buyersLocationPaginator || {};
    component.buyersLocationPaginator.initialItems = 'initialItems';
    component.buyersLocationPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getBuyerLocation');
    component.onSearchBuyerLocation({});
    expect(component._getBuyerLocation).toHaveBeenCalled();
  });


  it('onSearchDriver()', async () => {
    component.driversPaginator = component.driversPaginator || {};
    component.driversPaginator.initialItems = 'initialItems';
    component.driversPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getDrivers');
    component.onSearchDriver({});
    expect(component._getDrivers).toHaveBeenCalled();
  });


  it('onSearchVehicle()', async () => {
    component.vehiclesPaginator = component.vehiclesPaginator || {};
    component.vehiclesPaginator.initialItems = 'initialItems';
    component.vehiclesPaginator.searchTerm = 'searchTerm';
    spyOn(component, '_getVehicles');
    component.onSearchVehicle({});
    expect(component._getVehicles).toHaveBeenCalled();
  });


  it('setCompanyBranch()', async () => {
    component.companyBranchesPointPaginator = component.companyBranchesPointPaginator || {};
    component.companyBranchesPointPaginator.initialItems = 'initialItems';
    spyOn(component, '_getCompanyBranchesPoint');
    component.setCompanyBranch();
    expect(component._getCompanyBranchesPoint).toHaveBeenCalled();
  });


  it('setBuyer()', async () => {
    component.buyersLocationPaginator = component.buyersLocationPaginator || {};
    component.buyersLocationPaginator.initialItems = 'initialItems';
    component.buyersLocationPaginator.isLoading = 'isLoading';
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      get: function () {
        return {
          reset: function () { }
        };
      }
    };
    spyOn(component, '_getBuyerLocation');
    component.setBuyer();
    expect(component._getBuyerLocation).toHaveBeenCalled();
  });


  it('setCommodity()', async () => {
    spyOn(component, '_getCommodityTypes');
    spyOn(component, '_getCharacteristics');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              reset: function () { }
            };
          },
          patchValue: function () { }
        };
      }
    };
    component.setCommodity({});
    expect(component._getCommodityTypes).toHaveBeenCalled();
    expect(component._getCharacteristics).toHaveBeenCalled();
  });


  it('setCommodityType()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              reset: function () { }
            };
          },
          patchValue: function () { }
        };
      }
    };
    spyOn(component, '_getWarehouses');
    spyOn(component, '_getWareHouse');
    component.setCommodityType({
      transformationTypeId: {},
      transformationTypeName: {}
    }, {});
    expect(component._getWarehouses).toHaveBeenCalled();
    expect(component._getWareHouse).toHaveBeenCalled();
  });


  it('setCharacteristic()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              at: function () {
                return {
                  get: function () {
                    return {
                      value: {}
                    };
                  }
                };
              }
            };
          },
          value: {
            defaultValue: {}
          }
        };
      }
    };
    spyOn(component, '_updateCharacteristicsList');
    spyOn(component, '_applyDeduction');
    component.setCharacteristic({}, {});
    expect(component._updateCharacteristicsList).toHaveBeenCalled();
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('setDriver()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      patchValue: function () { }
    };
    component.setDriver({
      identity: {}
    });

  });


  it('setVehicle()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      patchValue: function () { }
    };
    component.setVehicle({
      vehicleType: {},
      license: {}
    });

  });


  it('setWarehouse()', async () => {
    spyOn(component, 'hideHightLimitNotification');
    component.setWarehouse({}, {});
    expect(component.hideHightLimitNotification).toHaveBeenCalled();
  });


  it('_setInitialItem()', async () => {

    component._setInitialItem({}, {
      findIndex: function () {
        return [
          null
        ];
      },
      push: function () { }
    }, {});

  });


  it('togglePanel()', async () => {
    spyOn(component, 'calculateWeightTotals');
    component.sections = component.sections || {};
    component.sections.section = {
      open: {}
    };
    component.togglePanel({}, {});
    expect(component.calculateWeightTotals).toHaveBeenCalled();
  });


  it('captureWeight()', async () => {
    component.sections = component.sections || {};
    component.sections.section = {
      open: {}
    };
    component.sections.weightCapture = {
      disabled: {},
      open: {}
    };
    component.captureWeight();

  });


  it('nextSection()', async () => {
    component.sections = component.sections || {};
    component.sections.section = {
      open: {}
    };
    component.sections.driverInformation = {
      disabled: {},
      open: {}
    };
    component.nextSection();

  });


  it('deleteWeight()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              removeAt: function () { }
            };
          }
        };
      }
    };
    spyOn(component, 'calculateWeightTotals');
    spyOn(component, '_applyDeduction');
    component.deleteWeight({}, {
      stopPropagation: function () { }
    }, {});
    expect(component.calculateWeightTotals).toHaveBeenCalled();
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('_applyDeduction()', async () => {
    component.deductionsTradingStatus = component.deductionsTradingStatus || {};
    component.deductionsTradingStatus.refTimeout = 'refTimeout';
    component.deductionsTradingStatus.isBeingCalculated = 'isBeingCalculated';
    component.destroyDeductionRequest$ = component.destroyDeductionRequest$ || {};
    spyOn(component.destroyDeductionRequest$, 'next');
    spyOn(component.destroyDeductionRequest$, 'complete');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              value: {}
            };
          },
          patchValue: function () { }
        };
      }
    };
    spyOn(component, 'hideHightLimitNotification');
    spyOn(component, '_getPenaltiesForTrading').and.returnValue({
      length: {}
    });
    spyOn(component, 'calculateWeightTotals');
    spyOn(component, '_sendRequestApply');
    component._applyDeduction({}, {});
    expect(component.destroyDeductionRequest$.next).toHaveBeenCalled();
    expect(component.destroyDeductionRequest$.complete).toHaveBeenCalled();
    expect(component.hideHightLimitNotification).toHaveBeenCalled();
    expect(component._getPenaltiesForTrading).toHaveBeenCalled();
    expect(component.calculateWeightTotals).toHaveBeenCalled();
    expect(component._sendRequestApply).toHaveBeenCalled();
  });


  it('_sendRequestApply()', async () => {
    component.deductionsTradingStatus = component.deductionsTradingStatus || {};
    component.deductionsTradingStatus.isBeingCalculated = 'isBeingCalculated';
    component.deductionsTradingStatus.timestamp = 'timestamp';
    component.deductionsTradingStatus.refTimeout = 'refTimeout';
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'applyDeductions').and.returnValue(observableOf({
      data: {
        timestamp: {},
        deductions: {
          idx: {}
        }
      }
    }));
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { },
          get: function () {
            return {
              controls: [{}]
            };
          }
        };
      }
    };
    component.CONSTANTS = component.CONSTANTS || {};
    component.CONSTANTS.DEDUCTION_TYPE = {
      TABLE: {},
      INPUT: {},
      CHOICE: {}
    };
    spyOn(component, 'calculateWeightTotals');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._sendRequestApply({}, {}, {});
    expect(component._shippingTicketService.applyDeductions).toHaveBeenCalled();
    expect(component.calculateWeightTotals).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('_getPenaltiesForTrading()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              controls: [{}]
            };
          }
        };
      }
    };
    component._getPenaltiesForTrading({}, {});

  });


  it('calculateWeightTotals()', async () => {
    spyOn(component, 'hideHightLimitNotification');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              controls: [{}]
            };
          },
          patchValue: function () { }
        };
      }
    };
    component.configuration = component.configuration || {};
    component.configuration.baseMeasurementUnitFactor = 'baseMeasurementUnitFactor';
    component.warehouse = component.warehouse || {};
    component.warehouse.stockLb = 'stockLb';
    component.calculateWeightTotals();
    expect(component.hideHightLimitNotification).toHaveBeenCalled();
  });


  it('onWarehouseEvent()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { },
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component.onWarehouseEvent({
      stockLb: {}
    }, {});

  });


  it('hideHightLimitNotification()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { }
        };
      }
    };
    component.hideHightLimitNotification({});

  });


  it('_updateCharacteristicsList()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      getRawValue: function () { }
    };
    component.characteristics = component.characteristics || {};
    component.characteristics = ['characteristics'];
    component._updateCharacteristicsList({});

  });


  it('eventChangePenaltyValue()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              at: function () {
                return {
                  patchValue: function () { }
                };
              }
            };
          }
        };
      }
    };
    spyOn(component, '_applyDeduction');
    component.eventChangePenaltyValue({}, {});
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('recalculateCharacteristicsValues()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return [{}];
      }
    };
    spyOn(component, '_applyDeduction');
    component.recalculateCharacteristicsValues();
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('addPenalty()', async () => {
    spyOn(component, '_updateCharacteristicsList');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              push: function () { }
            };
          }
        };
      }
    };
    spyOn(component, '_createPenaltyFormGroup');
    component.addPenalty({});
    expect(component._updateCharacteristicsList).toHaveBeenCalled();
    expect(component._createPenaltyFormGroup).toHaveBeenCalled();
  });


  it('removePenalty()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              removeAt: function () { }
            };
          }
        };
      }
    };
    spyOn(component, 'calculateWeightTotals');
    spyOn(component, '_applyDeduction');
    component.removePenalty({}, {});
    expect(component.calculateWeightTotals).toHaveBeenCalled();
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('setDeductionSelection()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          get: function () {
            return {
              at: function () {
                return {
                  patchValue: function () { }
                };
              }
            };
          }
        };
      }
    };
    spyOn(component, '_applyDeduction');
    component.setDeductionSelection({}, {
      name: {}
    }, {});
    expect(component._applyDeduction).toHaveBeenCalled();
  });


  it('submit()', async () => {
    spyOn(component, 'updateShippingTicket');
    spyOn(component, 'createShippingTicket');
    component.submit({});
    expect(component.updateShippingTicket).toHaveBeenCalled();
    expect(component.createShippingTicket).toHaveBeenCalled();
  });


  it('createShippingTicket()', async () => {
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () { },
      at: function () {
        return {
          patchValue: function () { },
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'createShippingTicket').and.returnValue(observableOf({
      data: {
        shipping_ticket_id: {}
      }
    }));
    component._notifierService = component._notifierService || {};
    spyOn(component._notifierService, 'notify');
    spyOn(component._notifierService, 'show');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform').and.returnValue('ngentest');
    component.generateReportsHelpClass = component.generateReportsHelpClass || {};
    spyOn(component.generateReportsHelpClass, 'onGenerateReportPdf');
    component._router = component._router || {};
    spyOn(component._router, 'navigateByUrl');
    spyOn(component, 'hideHightLimitNotification');
    component.warehouses = component.warehouses || {};
    component.warehouses.index = {
      find: function () {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component.createShippingTicket({});
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._shippingTicketService.createShippingTicket).toHaveBeenCalled();
    expect(component._notifierService.notify).toHaveBeenCalled();
    expect(component._notifierService.show).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component.generateReportsHelpClass.onGenerateReportPdf).toHaveBeenCalled();
    expect(component._router.navigateByUrl).toHaveBeenCalled();
    expect(component.hideHightLimitNotification).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
  });


  it('selectMovementInDialog()', async () => {
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component._dialog = component._dialog || {};
    spyOn(component._dialog, 'open').and.returnValue({
      afterClosed: function () {
        return observableOf({});
      }
    });
    component._router = component._router || {};
    spyOn(component._router, 'navigateByUrl');
    component.selectMovementInDialog();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._dialog.open).toHaveBeenCalled();
    expect(component._router.navigateByUrl).toHaveBeenCalled();
  });


  it('saveAndClose()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () { }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._WarehouseTransferService = component._WarehouseTransferService || {};
    spyOn(component._WarehouseTransferService, 'createOutputTransfer').and.returnValue(observableOf({
      data: {
        transaction_id: {}
      }
    }));
    component._notifierService = component._notifierService || {};
    spyOn(component._notifierService, 'notify');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform').and.returnValue('ngentest');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._router = component._router || {};
    spyOn(component._router, 'navigateByUrl');
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'stop');
    component.saveAndClose();
    expect(component._WarehouseTransferService.createOutputTransfer).toHaveBeenCalled();
    expect(component._notifierService.notify).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._router.navigateByUrl).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
  });


  it('closeShippingticketDialog()', async () => {
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component._dialog = component._dialog || {};
    spyOn(component._dialog, 'open').and.returnValue({
      afterClosed: function () {
        return observableOf({});
      }
    });
    spyOn(component, 'closeCompleteShippingTicket');
    component.closeShippingticketDialog({});
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._dialog.open).toHaveBeenCalled();
    expect(component.closeCompleteShippingTicket).toHaveBeenCalled();
  });


  it('closeCompleteShippingTicket()', async () => {
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () { }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._WarehouseTransferService = component._WarehouseTransferService || {};
    spyOn(component._WarehouseTransferService, 'createOutputTransfer').and.returnValue(observableOf({}));
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._router = component._router || {};
    spyOn(component._router, 'navigateByUrl');
    component.closeCompleteShippingTicket({});
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._WarehouseTransferService.createOutputTransfer).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component._router.navigateByUrl).toHaveBeenCalled();
  });


  it('updateShippingTicket()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          patchValue: function () { },
          get: function () {
            return {
              value: {}
            };
          }
        };
      }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'updateShippingTicket').and.returnValue(observableOf({}));
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'stop');
    component._notifierService = component._notifierService || {};
    spyOn(component._notifierService, 'notify');
    spyOn(component._notifierService, 'show');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform').and.returnValue('ngentest');
    component.generateReportsHelpClass = component.generateReportsHelpClass || {};
    spyOn(component.generateReportsHelpClass, 'onGenerateReportPdf');
    component._router = component._router || {};
    spyOn(component._router, 'navigateByUrl');
    spyOn(component, 'hideHightLimitNotification');
    component.warehouses = component.warehouses || {};
    component.warehouses.index = {
      find: function () {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component.updateShippingTicket({});
    expect(component._shippingTicketService.updateShippingTicket).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._notifierService.notify).toHaveBeenCalled();
    expect(component._notifierService.show).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component.generateReportsHelpClass.onGenerateReportPdf).toHaveBeenCalled();
    expect(component._router.navigateByUrl).toHaveBeenCalled();
    expect(component.hideHightLimitNotification).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
  });


  it('closeWeightNote()', async () => {
    spyOn(component, 'createSecondShippingTicket');
    spyOn(component, 'closeFirstWeightNote');
    component.closeWeightNote({});
    expect(component.createSecondShippingTicket).toHaveBeenCalled();
    expect(component.closeFirstWeightNote).toHaveBeenCalled();
  });


  it('createSecondShippingTicket()', async () => {
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () {
        return {
          index: {}
        };
      }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'updateShippingTicket').and.returnValue(observableOf({
      data: {}
    }));
    component.tabsWeightArray = component.tabsWeightArray || {};
    component.tabsWeightArray.index = {
      disable: {}
    };
    spyOn(component, '_closeIndividualNote');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component.createSecondShippingTicket({});
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._shippingTicketService.updateShippingTicket).toHaveBeenCalled();
    expect(component._closeIndividualNote).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('closeFirstWeightNote()', async () => {
    component.blockUILayout = component.blockUILayout || {};
    spyOn(component.blockUILayout, 'start');
    spyOn(component.blockUILayout, 'stop');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      getRawValue: function () { },
      patchValue: function () { }
    };
    component.shippingTicket.weightCapture = {
      getRawValue: function () {
        return {
          index: {}
        };
      },
      at: function () {
        return {
          get: function () {
            return {
              disable: function () { }
            };
          },
          patchValue: function () { }
        };
      }
    };
    component.shippingTicket.driverInformation = {
      getRawValue: function () { }
    };
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'createShippingTicket').and.returnValue(observableOf({
      data: {
        ticket_number: {}
      }
    }));
    component._notifierService = component._notifierService || {};
    spyOn(component._notifierService, 'notify');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component.tabsWeightArray = component.tabsWeightArray || {};
    component.tabsWeightArray.index = {
      disable: {}
    };
    spyOn(component, '_closeIndividualNote');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component.closeFirstWeightNote({});
    expect(component.blockUILayout.start).toHaveBeenCalled();
    expect(component.blockUILayout.stop).toHaveBeenCalled();
    expect(component._shippingTicketService.createShippingTicket).toHaveBeenCalled();
    expect(component._notifierService.notify).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component._closeIndividualNote).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
  });


  it('_closeIndividualNote()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          disable: function () { },
          patchValue: function () { }
        };
      }
    };
    component.tabsWeightArray = component.tabsWeightArray || {};
    component.tabsWeightArray.index = 'index';
    component._closeIndividualNote({
      weight_notes: {
        length: {},
        indexNote: {
          note_folio: {}
        }
      },
      shipping_ticket_id: {},
      note_status: {}
    }, {});

  });


  it('deleteNoteService()', async () => {
    component._shippingTicketService = component._shippingTicketService || {};
    spyOn(component._shippingTicketService, 'deleteShippingNote').and.returnValue(observableOf({}));
    spyOn(component, 'deleteViewWeightNote');
    component.deleteNoteService({}, {});
    expect(component._shippingTicketService.deleteShippingNote).toHaveBeenCalled();
    expect(component.deleteViewWeightNote).toHaveBeenCalled();
  });


  it('deleteViewWeightNote()', async () => {
    component.tabsWeightArray = component.tabsWeightArray || {};
    spyOn(component.tabsWeightArray, 'splice');
    component.warehouses = component.warehouses || {};
    spyOn(component.warehouses, 'splice');
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.weightCapture = {
      removeAt: function () { },
      controls: {
        length: {}
      }
    };
    component.deleteViewWeightNote({});
    expect(component.tabsWeightArray.splice).toHaveBeenCalled();
    expect(component.warehouses.splice).toHaveBeenCalled();
  });


  it('disabledCloseNote()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.generalInformation = {
      invalid: {}
    };
    component.shippingTicket.driverInformation = {
      invalid: {}
    };
    component.shippingTicket.weightCapture = {
      at: function () {
        return {
          disabled: {},
          invalid: {}
        };
      }
    };
    component.tabsWeightArray = component.tabsWeightArray || {};
    component.tabsWeightArray.index = {
      disable: {}
    };
    component.disabledCloseNote({});

  });


  it('disabledCloseShippingTicket()', async () => {
    component.tabsWeightArray = component.tabsWeightArray || {};
    spyOn(component.tabsWeightArray, 'every').and.returnValue([
      {
        "disable": {}
      }
    ]);
    component.disabledCloseShippingTicket();
    expect(component.tabsWeightArray.every).toHaveBeenCalled();
  });


  it('setOwnerType()', async () => {
    component.driversPaginator = component.driversPaginator || {};
    component.driversPaginator.isLoading = 'isLoading';
    component.vehiclesPaginator = component.vehiclesPaginator || {};
    component.vehiclesPaginator.isLoading = 'isLoading';
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      get: function () {
        return {
          updateValueAndValidity: function () { },
          disable: function () { },
          patchValue: function () { },
          enable: function () { },
          clearValidators: function () { }
        };
      },
      reset: function () { }
    };
    spyOn(component, '_getTransportCompanies');
    spyOn(component, '_getDrivers');
    spyOn(component, '_getVehicles');
    component.setOwnerType({});
    expect(component._getTransportCompanies).toHaveBeenCalled();
    expect(component._getDrivers).toHaveBeenCalled();
    expect(component._getVehicles).toHaveBeenCalled();
  });


  it('paginationTransport()', async () => {
    component._transportCompanyPaginator = component._transportCompanyPaginator || {};
    component._transportCompanyPaginator.nextPageUrl = 'nextPageUrl';
    spyOn(component, '_getTransportCompanies');
    component.paginationTransport();
    expect(component._getTransportCompanies).toHaveBeenCalled();
  });


  it('_getTransportCompanies()', async () => {
    component._companyService = component._companyService || {};
    spyOn(component._companyService, 'getTransportCompanies').and.returnValue(observableOf({
      data: {},
      paginator: {}
    }));
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      get: function () {
        return {
          enable: function () { },
          disable: function () { },
          updateValueAndValidity: function () { },
          setValidators: function () { }
        };
      }
    };
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._getTransportCompanies({});
    expect(component._companyService.getTransportCompanies).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
  });


  it('setCompanyDelivered()', async () => {
    component.shippingTicket = component.shippingTicket || {};
    component.shippingTicket.driverInformation = {
      patchValue: function () { },
      get: function () {
        return {
          enable: function () { },
          patchValue: function () { }
        };
      },
      updateValueAndValidity: function () { }
    };
    spyOn(component, '_getDrivers');
    spyOn(component, '_getVehicles');
    component.setCompanyDelivered({
      id: {}
    });
    expect(component._getDrivers).toHaveBeenCalled();
    expect(component._getVehicles).toHaveBeenCalled();
  });


  it('_getDefaultSacksValue()', async () => {
    spyOn(component, '_getConfigurationOfCompanyByName').and.returnValue({
      value: {}
    });
    component._getDefaultSacksValue({});
    expect(component._getConfigurationOfCompanyByName).toHaveBeenCalled();
  });


  it('_getDefaultTareValue()', async () => {
    spyOn(component, '_getConfigurationOfCompanyByName').and.returnValue({
      value: {}
    });
    component.configuration = component.configuration || {};
    component.configuration.tareFactor = 'tareFactor';
    component._getDefaultTareValue({});
    expect(component._getConfigurationOfCompanyByName).toHaveBeenCalled();
  });


  it('_getConfigurationOfCompanyByName()', async () => {

    component._getConfigurationOfCompanyByName({});

  });


  it('_getScales()', async () => {
    component._iotDevicesService = component._iotDevicesService || {};
    spyOn(component._iotDevicesService, 'getScalesByUser').and.returnValue(observableOf({}));
    component._alertService = component._alertService || {};
    spyOn(component._alertService, 'errorTitle');
    component._i18nPipe = component._i18nPipe || {};
    spyOn(component._i18nPipe, 'transform');
    component._errorHandlerService = component._errorHandlerService || {};
    spyOn(component._errorHandlerService, 'handleError');
    spyOn(component, '_disabledSections');
    component._getScales();
    expect(component._iotDevicesService.getScalesByUser).toHaveBeenCalled();
    expect(component._alertService.errorTitle).toHaveBeenCalled();
    expect(component._i18nPipe.transform).toHaveBeenCalled();
    expect(component._errorHandlerService.handleError).toHaveBeenCalled();
    expect(component._disabledSections).toHaveBeenCalled();
  });


  it('setWareHouseType()', async () => {
    const type = 1;
    const index = 0;
    spyOn(component, '_getWareHouse');
    component.setWareHouseType(type, index);
    expect(component._getWareHouse).toHaveBeenCalled();
  });
});
