import { environment } from '../../../environments/environment';

export const URIS_CONFIG = {
    BASE_URI: environment.CAS_URL_API,
    SIGN_IN: 'sign/1',
    SIGN_OUT: '/signout',
    API_USERS: '/web/users',
    API_SECURITY: '/web/security',
    GET_PERMISSIONS: '/web/permissions?',
    API_SEASON: '/web/season',
    API_SEASONS: '/web/seasons',
    GET_LOCATION: '/web/locations',
    GET_COMPANY_INFO: '/web/get_company_info',
    API_COMPANY_INFO: '/web/company_info',
    API_FARMS: '/web/farms',
    API_CUDREQUEST: '/web/',
    API_DRIVERS: '/web/drivers',
    API_TRUCKS: '/web/trucks',
    API_UNITS_MEASURE: '/web/measurement-units',
    API_CERTIFICATION: '/web/certifications',
    API_REMOVE_CONVERTION: '/web/removeUnitConvertion',
    GET_COMMODITIES_GENERAL: '/web/listCommoditiesGeneral',
    API_SEALS_SELLERS: '/web/sellers',
    CERTIFICATION_FARMS: '/web/certificationsFarms',
    API_PROD_COMMODITY: '/web/prodCommodities',
    API_VARIETIES_BY_COMMODITY: '/web/varietiesByCommodity',
    API_COMMODITY_TRANSFORMATIONS: '/web/commoditiesTransformation',
    WAREHOUSE_TANKS: '/web/prodTanks',
    API_TRANSFORMATIONS: '/web/transformationsTypes',
    API_CERTIFICATION_FARM: '/web/getCertificationsFarm',
    API_CERTIFICATIONS: '/web/getCertifications',
    API_TANK_COMMODITY: '/web/getTanksTransformationType',
    API_WAREHOUSE_TANKS: '/web/productionTanks',
    API_TRANSFORMATION_TYPES: '/web/getTransformationsTypes',
    API_VIRTUAL_TANKS: '/web/getVirtualTanks',
    VIRTUAL_TANKS_MEASUREMENT_ID: '/web/getMeasurementUnitDefault',
    API_PRODUCTION_TYPES: '/web/productionTypes',
    API_WORKFLOW: '/web/workflows',
    API_WORKFLOW_PROCESS_BY_COMMODITY: '/web/processByCommodity',
    API_WORKFLOW_PROCESSES: '/web/processes',
    API_SUBTANKS: '/web/getProductionTanks',
    API_CONFIGURATION: '/web/getConfig',
    API_CONFIGURATION_TARE: '/web/measurementUnitsTares',
    API_WEIGHT_NOTE: '/web/weightNotes',
    API_WEIGHT_NOTES: '/web/weight-notes',
    API_WEIGHT_PRODUCTION: '/web/weight-notes',
    API_WEIGHT_NOTE_LIST: '/web/reception-notes',
    API_REPORTS_NOTE_RECEPTION: '/web/reports/receptions-notes',
    API_WORKFLOW_PROCESSES_LIST: '/web/workflowsProcesses',
    API_SUBTANK: '/web/getProductionTankById',
    API_PROD_VARIETY: '/web/prodVariety',
    API_PRODUCERS: '/web/producers',
    API_PRODUCERS_FARMS: '/web/prodFarms',
    API_BLOCKS_BY_PRODUCER: '/web/getBlocksByProducer',
    API_CSV_PRODUCERS: '/web/getCSVProducers',
    API_RELATED_PRODUCERS: '/web/producers/linked',
    API_FARMS_BY_PRODUCER: '/web/getFarmsByProducer',
    API_BLOCKS: '/web/prodBlocks',
    API_CHANGE_STATUS_WEIGHT_NOTE: '/web/changeStatusNotes',
    API_RECEPTION_NOTE: '/web/weightNoteByReception',
    API_BLOCKS_BY_SELLER: '/web/getBlocksBySeller',
    API_BLOCSK: '/web/getBlocks',
    API_PRODUCERS_WITH_FARMS: '/web/producersFarms',
    API_TRANSFORMATIONS_TYPES_BY_COMMODITY:
        '/web/transformationTypesByCommodity',
    API_CHARACTERISTICS: '/web/characteristics',
    API_DEDUCTIONS_TRADING: '/web/deductions/trading',
    API_GET_CONFIG_COMPANY_INFO: '/web/company-info',
    API_UPDATE_BLOCK_WEIGHT_NOTE: '/web/updateBlockFromWeightNote',
    API_PRODUCTION_FLOW: '/web/productionFlow',
    API_COUNTRIES_LOOKUP: '/web/countries',
    API_STATES_LOOKUP: '/web/states',
    API_CITIES_LOOKUP: '/web/cities',
    API_TOWNS_LOOKUP: '/web/villages',
    API_PRODUCER_SEALS: '/web/getCertifications',
    API_LOTS: '/web/lots',
    API_PRODUCTION_FLOWS: '/web/production-flows',
    API_KANBAN: '/web/kanban',
    API_KANBAN_DASHBOARD: '/web/kanban-dashboard',
    API_LOT_EVENTS: '/web/lots-events',
    API_LOT_TRANSITION: '/web/lots-transitions',
    API_REPORTS_LOT_TRAMSITION: '/web/reports/lots-transitions',
    API_WORKFLOWS_LOT: '/web/workflows-lot',
    API_REPROCESS_LOT: '/web/reprocess-lot',
    API_LOT_HISTORY: '/web/lots-history',
    API_PROFILE_SETTINGS: '/web/profile-settings',
    API_CONTRACT_CHARACTERISTICS: "/web/contract-characteristics",
    API_PURCHASE_ORDERS_WEIGHT_NOTES: "/web/weight-notes/purchase-orders",
    API_PURCHASE_ORDERS: "/web/purchase-orders",
    API_PURCHASE_ORDER_DETAILS: "/web/purchase-orders-detail",
    API_CONTRACTS_BY_PRODUCER: "/web/purchase-order/contracts",
    API_PURCHASE_ORDERS_CSV: '/web/purchase-orders/export',
    API_PURCHASE_ORDERS_PDF: '/web/reports/purchaseOrder',
    API_PURCHASE_ORDERS_DETAIL: '/web/purchase-orders-detail',
    API_PURCHASE_ORDERS_CONTRACTS: "/web/purchase-order/contracts",
    API_PURCHASE_ORDERS_RESENT_SETTLEMENT: "/purchase-orders/resend",
    API_IOTS: '/web/iots',
    API_IOTS_AVAILABLE_TO_CREATE: '/web/iots/available-to-create',
    API_IOTS_USER_LIST: '/web/iots/user/list',
    API_IOTS_MODELS: '/web/iot-models',
    API_IOTS_BRANDS: '/web/iot-brands',
    API_PROFESSIONS: '/web/professions',
    API_SCHOLARSHIP: '/web/scholarships',
    API_MARITAL_STATUS: '/web/marital-status',
    API_SHADE_VARIETIES: '/web/shade-variety',
    API_SOIL_TYPES: '/web/soil-type',
    API_COFFEE_VARIETIES: '/web/variety-coffee',
    API_LOT_TRANSITION_DECREASE: '/web/decrease-lot-transition',
    API_COMPANY_BRANCHES: '/web/company-branches',
    API_BUYERS: '/web/buyers',
    API_REASON_TRANSFER: '/web/reasons-transfer',
    API_VEHICLE_TYPES: '/web/vehicle-types',
    API_WAREHOUSES_EXTERNAL: '/web/warehouses',
    API_SHIPPING_TICKET: '/web/shipping-ticket',
    API_SHIPPING_NOTES: '/web/shipping-note',
    API_SHIPPING_NOTE: '/web/reports/general-shipping-note',
    WORKER_SYNC: {
        PENDING_ACTIONS: 'pending-actions',
        SYNC_CONTRACTS: 'contracts'
    },
    API_UPDATES_RECEPTION_NOTES: '/web/update-receptions-notes',
    API_BUYERS_CSV: '/web/buyers/export/csv',
    API_REPORT_LOT_DETAIL: '/web/report-detail-lot',
    API_REPORT_LOT_GENERAL: '/web/report-general-lot',
    API_TRANSPORT_COMPANY: '/web/transport-company',
    API_MERGE_LOT: '/web/lots-merge',
    API_CUPPING: '/web/tastings',
    //TODO change to web/form/cupping
    API_CUPPING_FORMS: '/web/forms/cupping',
    API_LOT_CATACION_DETALLE: '/web/lots',
    API_REPORTS_CATATION: '/web/reports/tastings',
    API_FORM_ADDRESS: '/web/forms/address',
    API_TANKS_TYPES: '/web/tanks-types',
    API_TRANSFER_MOVEMENTS: '/web/movements',
    API_WAREHOUSE_TRANSFER: '/web/movements',
    API_LOTS_BY_STATUS: '/web/lots-by-status',
    API_RECEPTION_NOTES: '/web/reception-notes',
    API_RETENTION_ORDERS: '/web/retention-orders',
    API_TRUCKS_FILTERS: '/web/trucks-filters',
    API_DRIVERS_FILTERS: '/web/drivers-filters',
};
