import { CANCELLED } from 'dns';
import { environment } from '../../../../environments/environment';
export const CONSTANTS = {
    API_WORKER_SYNC: environment.API_WORKER_SYNC,
    COMPANY_NAME: environment.COMPANY_NAME,
    WORKER_SYNC_IDENTIFIER: 'IDENTIDAD',
    ALPHANUMERIC_PATTERN:
        '^(^([a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ. ]{1})&*([a-z A-Z0-9 ñÑáéíóúüÁÉÍÓÚÜ. ]){0,255})*([a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ. ]{1})$',
    IHCAFE_PATTERN: /^[a-zA-Z0-9àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ\- ]*$/,
    ALPHANUMERIC_REGEXP: /[a-zA-Z0-9àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]+/,
    ADDRESS_PATTERN: /^[a-zA-Z0-9àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ#',.\- ]*$/,
    NAME_PATTERN: /^[a-zA-Z0-9àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ#\- ]*$/,
    ALPHABET_REGEXP: /^(?=\S)[a-zA-ZÀ-ÖØ-öø-ÿ' ]+$/,
    ALPHABETICAL_PATTERN:
        '^(^([a-zA-ZñÑáéíóúüÁÉÍÓÚÜ. ]{1})&*([a-z A-Z ñÑáéíóúüÁÉÍÓÚÜ. ]){0,256})*([a-zA-ZñÑáéíóúüÁÉÍÓÚÜ. ]{1})$',
    LICENSE_REGEXP: /^[a-zA-Z0-9àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ\-]*$/,
    NO_BLANK_START: /^\S/,
    EMAIL_REGEXP: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/,
    NUMBER_REGEXP: /^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/,
    ZIP_CODE_REGEXP: /^[0-9]{5}(?:-[0-9]{4})?$/,
    GET_NUMBER: /[^/\\0-9.]+/g,
    ZIP_CODE_MASK: [
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/],
    IDENTITY_MASK: [
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ],
    MIN_AGE: 18,
    MAX_LENGTH_PRODUCER_NAME: 255,
    MAX_LENGTH_PRODUCER_FATHER_LAST_NAME: 250,
    MAX_LENGTH_PRODUCER_MOTHER_LAST_NAME: 250,
    MAX_LENGTH_PRODUCER_EXTERNAL_ID: 45,
    MAX_LENGTH_PRODUCER_CARNET_IHCAFE: 45,
    MAX_LENGTH_EMAIL: 255,
    MAX_LENGTH_PHONE: 50,
    MAX_LENGTH_BLOCK_NAME: 255,
    MAX_LENGTH_FARM_NAME: 255,
    MAX_LENGTH_SHOW_FARM_NAME: 256,
    MAX_LENGTH_FARM_ADDRESS: 50,
    MAX_LENGTH_FIELD_TICKET: 255,
    MAX_LENGTH_CONTRACT_ID: 50,
    MAX_LENGTH_DRIVER_NAME: 250,
    MAX_LENGTH_DRIVER_PATERNAL_LAST: 250,
    MAX_LENGTH_DRIVER_MATERNAL_LAST: 250,
    MAX_LENGTH_DRIVER_LICENSE: 50,
    MAX_LENGTH_TRUCK_LICENSE: 50,
    MAX_LENGTH_TRUCK_NAME: 250,
    MAX_LENGTH_COMMODITY_ALIAS_NAME: 150,
    MAX_LENGTH_VARIETY_NAME: 250,
    MAX_LENGTH_COMMODITY_TYPE_NAME: 250,
    MAX_LENGTH_TEXT_NOTE: 255,
    MAX_LENGTH_DESCRIPTION_WORKFLOW: 255,
    MIN_LENGTH_PRODUCER_IDENTITY: 13,
    MIN_LENGTH_DRIVER_IDENTITY: 13,
    MAX_LENGTH_PRODUCER_ADDRESS: 255,
    MAX_LENGTH_SHOW_PRODUCER_ADDRESS: 256,
    MAX_LENGTH_ADDRESS: 255,
    INTERNATIONAL_PHONES: {
        MEXICO: {
            PREFIX: '+52',
            REGEXP: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
            LENGTH: 10,
            MASK: [
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ],
        },
        HONDURAS: {
            PREFIX: '+504',
            REGEXP: /^[0-9]{4}-[0-9]{4}$/,
            LENGTH: 8,
            MASK: [
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ],
        },
        USA: {
            PREFIX: '+1',
            REGEXP: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
            LENGTH: 10,
            MASK: [
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ],
        },
    },

    INTERNATIONAL_ID_NUMBERS: {
        RTN: {
            MIN_LENGTH: 14,
            PATTERN: /[a-zA-Z0-9]{13,14}/,
        },
    },

    ACTIONS_MODE: {
        EDIT: 0,
        NEW: 1,
    },

    OPTIONS_MODAL_WEIGHT_NOTE: {
        PRODUCER: 0,
        FARM: 1,
        BLOCK: 2,
        DRIVER: 3,
        TRUCK: 4,
    },

    CRUD_ACTION: {
        CANCEL: 0,
        CREATE: 1,
        READ: 2,
        UPDATE: 3,
        DELETE: 4,
        NEXT: 5,
        ACCEPT: 6,
        DOWNLOAD: 7,
        PRINT: 8,
        RESEND: 9,
        CLOSE: 10,
        VIEW: 11,
        VOID: 12
    },

    VIEW_MODE: {
        LIST: 0,
        ACTION: 1,
    },

    LOT_STATUS: {
        IN_PROGRESS: 0,
        PROCESSED: 1,
    },
    PURCHASE_ORDER_STATUS: {
        CREATED: 1,
        LIQUIDATE: 2,
    },
    RECEIVING_NOTE_STATUS: {
        OPEN: 0,
        CLOSED: 1,
    },

    RECEIVING_NOTE_PRODUCTION_STATUS: {
        PROCESS: 0,
        PROCESSED: 1,
        UNPROCESSED: 2
    },

    WAREHOUSE_TRANSFER_STATUS: {
        OPEN: 1,
        CLOSE: 2,
        CANCELED: 3,
    },

    WAREHOUSE_TRANSFER_STATUS_DESCRIPTION: {
        OPEN: 'open',
        CLOSE: 'close',
        CANCELED: 'canceled',
    },

    WEIGHT_NOTE_STATUS: {
        OPEN: 1,
        CLOSED: 2,
        DELETED: 3,
    },

    ACTION_MODE_WAREHOUSE: {
        CREATE_TANK: 0,
        EDIT_TANK: 1,
        CREATE_SUBTANK: 2,
        EDIT_SUBTANK: 3,
    },

    SUBTANKS_LEVELS: {
        HIGH: {
            COLOR: '#d63649',
            LABEL: 'critic-level',
            CLASS: 'high-level-use',
        },
        NORMAL: {
            COLOR: '#0068d1',
            LABEL: 'good-level',
            CLASS: 'normal-level-use',
        },
        LOW: {
            COLOR: '#f7c137',
            LABEL: 'low-level',
            CLASS: 'low-level-use',
        },
    },

    PRODUCER_TYPE: {
        ASSOCIATE: 1,
        PROVIDER: 2,
        CLIENT: 3
    },

    PRODUCER_FORM_OWNER: {
        PRODUCERS: 'producers',
        WEGHT_NOTES: 'weight-note',
    },

    DEDUCTION_TYPE: {
        TABLE: 'table',
        CHOICE: 'choice',
        INPUT: 'input'
    },

    DEDUCTION_ACTIONS: {
        ADD: 'add',
        SUBSTRACT: 'subtract',
    },

    DATE_FORMATS: {
        FILTER: {
            LOCALE: {
                es: 'DD/MM/YY',
                en: 'MM/DD/YY',
            },
            ADAPTER: {
                parse: {
                    dateInput: 'DD/MM/YY',
                },
                display: {
                    dateInput: 'DD/MM/YY',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY',
                },
            },
        },
        PURCHASE_ORDERS: {
            LOCALE: {
                es: 'DD/MM/YY',
                en: 'MM/DD/YY',
            },
            ADAPTER: {
                parse: {
                    dateInput: 'dddd DD MMMM y',
                },
                display: {
                    dateInput: 'dddd DD MMMM y',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY',
                },
            },
        },
        PRODUCER: {
            LOCALE: {
                es: 'DD / MM / YYYY',
                en: 'MM / DD / YYYY',
            },
            LABEL: {
                es: 'dd / MM / yyyy',
                en: 'MM / dd / yyyy',
            }
        },
    },
    LOT_TYPES: {
        NANO_LOTE: 'Nanolote',
        MICRO_LOTE: 'Microlote',
        MACRO_LOTE: 'Macrolote',
    },
    PERMISSIONS: {
        ALL: 'all',
        IOTS: 'devices',
        FARMS: 'farms',
        SEALS: 'seals',
        TRUCKS: 'trucks',
        BLOCKS: 'blocks',
        SCALES: 'scales',
        KANBAN: 'kanban',
        DRIVERS: 'drivers',
        WORKFLOW: 'workflow',
        WAREHOUSE: 'warehouse',
        PRODUCERS: 'producers',
        COMMODITIES: 'commodities',
        WEIGHT_NOTE: 'receiving-weight-notes',
        WAREHOUSE_TRANSFER: 'warehouse-transfer',
        LOT_REPROCESS: 'reprocess-lot',
        LOTS: 'lots',
        PURCHASE_ORDER: 'purchase-orders',
        SHIPPING_TICKET: 'shipping-ticket',
        RELATED_PRODUCERS: 'related-producers',
        MEASUREMENT_UNITS: 'measurement-units',
        TRANSFORMATION_TYPES: 'transformations-types',
        UPDATE_CLOSE_NOTE: 'update-receptions-notes',
        BUYERS: 'buyers',
        CUPPING: 'lots-cupping',
        RETENTION_ORDERS: 'retention-orders',
    },
    PERMISSION_TYPES: {
        READ: 'read',
        PRINT: 'print',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        REPRINT: 'reprint',
        SHOWMENU: 'show_menu',
        VOID: 'void'
    },
    SIGNED_VALUE_TYPES: {
        EXCEDENT: 'excedent',
        DISCCOUNT: 'discounts',
    },
    FILE_REPORT_ACTIONS: {
        FORMAT: {
            PDF: 'pdf',
            CSV: 'csv',
        },
        DOWNLOAD: 'download',
        PRINT: 'print',
        EMAIL: 'mail',
        TYPE: {
            DETAILED: 1,
            GENERAL: 0
        }
    },
    LOT_HISTORY_TYPES: {
        CREATED: 'created',
        TRANSITION_CREATED: 'transition_created',
        TRANSITION_UPDATED: 'transition_updated',
        NOTE_CREATED: 'note_created',
        NOTE_DELETED: 'note_deleted',
        DAMAGE_LOT: 'note_damage',
        REPROCESS_LOT: 'reprocess-lot',
        FINALIZED_LOT: 'finalized',
        TASTING_CREATED: 'tasting_created'
    },
    SCALE_LISTENER_STATUS: {
        UNSELECTED: 'unselected',
        DISABLED: 'disabled',
        CONNECTING: 'connecting',
        DISCONNECTED: 'disconnected',
        STABILIZING: 'stabilizing',
        STABILIZED: 'stabilized',
        RESET: 'reset'
    },
    SOCKET_CLIENT_STATUS: {
        DISCONNECTED: 'disconnected',
        CONNECTING: 'connecting',
        CONNECTED: 'connected',
        STATUS: 'ip-status',
        ONLINE: 'online',
        OFFLINE: 'offline',
        DEVICE_LIST: 'iot-list',
        DEVICE_STATUS: 'device-status'
    },
    IOT_EVENT_TYPE: {
        WEIGHT: 'weight',
        SORTER_MACHINE: 'sorter_machine',
        STATUS_CONNECTION: 'status_connection'
    },
    SORTER_MACHINE_REQUEST_TIME: 10000,
    SCALE_SOCKET_CONFIG_KEYS: {
        URL: 'scale_socket',
        PORT: 'scale_socket_port'
    },
    DATE_FORMAT_LOCALE: {
        es: 'DD MMM, YYYY HH:mm',
        en: 'MMM DD, YYYY HH:mm',
    },
    VALID_IP_REGEXP: '^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\\.(?!$)|$)){4}$',
    PROCESS_FLOW: {
        IN: 'in',
        OUT: 'out'
    },
    LOT_PENDING_PROCESS: 'pending_process',

    PURCHASE_ORDER_SETTLED_STATUS: {
        OPEN: 0,
        IN_SETTLED_PROCESS: 1
    },

    PURCHASE_ORDER_SETTLING_STATUS: {
        RECEIVED: 1, // received by trumodity
        READ: 2,
        SETTLED: 3,
        CANCELLED: 4,
        CREATED: 5,
        PENDING: 6,
        SENT: 7,
        PAID: 8,
        DUPLICATED: 9
    },

    IOT_DEVICE_TYPE: [
        {
            id: 'scale',
            name: 'scale'
        },
        {
            id: 'sorter-machine',
            name: 'sorter-machine'
        },
    ],
    IOT_DEVICE_TYPES: {
        SCALE: 'scale',
        SORTER_MACHINE: 'sorter-machine'
    },
    NEW_PRODUCER_TABS: {
        REFERENCE: 0,
        GENERAL: 1
    },
    DIMENSIONS_AREAS: {
        PRODUCTIVE_AREA_KEY: 'productive_area',
        EXTENSION_AREA_KEY: 'extension',
        WASTELAND_AREA_KEY: 'wasteland_area'
    },
    GENDERS: {
        MALE: 'male',
        FEMALE: 'female',
        OTHER: 'other'
    },
    FEDERATE_APPS_CODE: {
        SILOSYS: 'silosys',
        SEED_AUDIT: 'seed-audit',
        HARVX: 'harvx',
        COMMODITY_V1: 'commodity-v1',
        COMMODITY_V2: 'commodity-v2',
        TP_SUMMA: 'tp-suma'
    },
    SHOW_CHARACTERISTICS: {
        WEIGHT_NOTE: '1',
        PURCHASE_ORDER: '2'
    },
    SHIPPING_TICKET_STATUS: {
        OPEN: 1,
        CLOSED: 2,
        DELETED: 3,
        VOIDED:4
    },
    WIDTH_SCREEN: {
        TABLET: 768,
        MOBILE: 425,
        DESKTOP: 1024
    },
    WEIHIGIN_TABLE_DEFAULT_SACKS_NUMBER: 1,
    MODAL_ASSOCIATED_NOTE_TYPE: {
        RECEPTION_NOTE: 0,
        WEIGHT_NOTE: 1,
        PRODUCTION_WEIGHT_NOTE: 2
    },
    WORKER_SYNC_ACTIONS: {
        FEDERATION_DATA: 'sync-federation-data'
    },
    PRICE_PLACE_FEATURE_ID: 'Precio de la plaza',
    TYPE_WEIGHT_NOTE: {
        ENTRY: 0,
        PRODUCTION: 1
    },
    MEASUREMENT_UNIT: {
        BASE: 'lb',
        CONVERSION: 'qq'
    },
    DEFAULT_SYSTEM_SETTINGS: {
        LANG: 'es',
        GENERAL_DECIMALS: 2
    },
    DRIVER_TYPE: {
        OWNER: 1,
        THIRD: 2,
    },
    TRANSPORT_SERVICE_TYPE: {
        OWNER: 1,
        THIRD: 2,
    },
    WAREHOUSE_TYPE: {
        PHYSICAL: 1,
        VIRTUAL: 2
    },
    WAREHOUSE_MOVEMENT_OPERATION: {
        OPEN: 'open',
        CLOSED: 'closed',
        CLOSE: 'close'
    },
    WAREHOUSE_MOVEMENT_CRITERIA_ID: 1,
    LOADS_CONFIG: {
        ALLOWABLE_EMPTY_LOAD_VALUE: 1,
        NOT_ALLOWABLE_EMPTY_LOAD_VALUE: 0,
        LOAD_EMPTY_ALLOWED: 'load_empty_allowed',
        LOAD_DEFAULT_CONTAINER: 'load_default_container',
        LOAD_DEFAULT_TARE: 'load_default_tare',
    },

    TYPE_FIELDS_TASTING: {
        AVERAGE: 'average',
        DAMAGE_AVERAGE: 'damage_average',
        DAMAGE: 'damage',
        DEFECT: 'defects',
        ROAST: 'roast',
        LAB_DETAILS: 'lab_details',
        OTHER: 'other',
        DATE: 'date'
    },
    LANGUAGE_PATH: 'assets/api/lang/',
    AVAILABLE_LANGUAGE: {
        COMPANY: {
            en_capucas: "en-capucas",
            es_solcafe: "es-solcafe",
            en_solcafe: "en-solcafe",
            es_ecocacao: "es-ecocacao",
            en_ecocacao: "en-ecocacao",
        },
        DEFAULT: {
            en: "en",
            es: "es",
        }
    },
    DEFAULT_CURRENCY: {
        symbol: "L.",
        name: "Lempira",
        isoCode: "HNL",
        description: "Lempira Hondureño",
    },

    PARAM_WEIGHING_TABLE: {
        KANBAN: 'kanban',
        WEIGHT_NOTE: 'weight_note',
        SHIPPING_TICKET: 'shipping_ticket',
        WAREHOUSE_TRANSFER: 'warehouse_transfer',
    },
    TYPE_OF_TANKS: {
        PHYSICAL: 1,
        VIRTUAL: 2,
    },
    CHARACTERISTICS_FILTER_OPERATION_TYPE: {
        EQUAL: 0,
        LESS: 1,
        GREATER: 2,
        RANGE: 3
    },
    CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION: [
        {
            id: 0,
            label: "equal-than"
        },
        {
            id: 1,
            label: "less-than"
        },
        {
            id: 2,
            label: "greater-than"
        },
        {
            id: 3,
            label: "range"
        }
    ],
    CONFIGURATION_WEIGHING_TABLE_ID: 18,
    DEDUCTIONS_ALLOW_ACTIONS: {
        PERCENTAGE: "percentage",
        NO_ACTION: "no_action",
        ADD: "add",
        SUBTRACT: "subtract"
    },
    MAX_SAFE_INTEGER: 9007199254740991,
    TYPE_TRUCK_SEARCH_FIELD: {
        LICENSE: 'license',
        NAME: 'name',
        TYPE: 'type'
    },
    PAYMENT_STATUS: {
        UNSETTLED: 0,
        PROCESS: 1,
        LIQUIDATED: 2,
    },
    WEIGHT_NOTES_STATUS: {
        0: "pending",
        1: "process",
        2: "processed",
    },
    SCALES_MEASUREMENT_UNIT: {
        LB: 'lb',
        KG: 'kg',
        G: 'g',
        PROCESS: 0,
        LIQUIDATED: 1,
        UNSETTLED: 2
    },
    RETENTION_ORDER_STATUS: {
        OPEN: 1,
        CLOSED: 2,
        DISABLED: 3,
        DELETED: 4,
    },
    PAGINATOR: {
        PAGE_SIZE: [10, 25, 50, 100]
    },
    MENU_BAR_STEPS: {
        POSITION_ONE: 1,
        POSITION_TWO: 2,
        POSITION_THREE: 3
    },
    TRUCK_SERVICE_TYPE: {
        PROPIO: 1,
        TERCERO: 2
    }
};
