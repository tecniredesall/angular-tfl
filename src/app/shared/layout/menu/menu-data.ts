import { CONSTANTS } from '../../utils/constants/constants';

export const menuData = {
    apps: {
        Transformaciones: {
            "reception": [
                {
                    id: 'dashboard',
                    name: 'dashboard',
                    link: '/routes/t-dashboard',
                    icon: 'icon-dashboard',
                    class: '',
                },
                {
                    id: 'kanban',
                    tag: CONSTANTS.PERMISSIONS.KANBAN,
                    name: 'kanban',
                    link: '/routes/kanban',
                    icon: 'icon-kanban',
                    class: '',
                },
                {
                    id: 'weightNote',
                    tag: CONSTANTS.PERMISSIONS.WEIGHT_NOTE,
                    name: 'weight-note-lote',
                    link: '/routes/weight-note',
                    icon: 'icon-notas-r',
                    class: ''
                },
                {
                    id: 'purchase-order',
                    tag: CONSTANTS.PERMISSIONS.PURCHASE_ORDER,
                    name: 'purchase-orders',
                    link: '/routes/purchase-orders',
                    icon: 'icon-purchase-order',
                    class: '',
                },
                {
                    id: 'retention-orders',
                    tag: CONSTANTS.PERMISSIONS.RETENTION_ORDERS,
                    name: 'retention-orders',
                    link: '/routes/retention-orders',
                    icon: 'icon-retention',
                    class: '',
                },
                {
                    id: 'producers',
                    tag: CONSTANTS.PERMISSIONS.PRODUCERS,
                    name: 't-producers',
                    link: '/routes/producers',
                    icon: 'icon-Producers-2',
                    class: '',
                },
                {
                    id: 'shipping-tickets',
                    tag: CONSTANTS.PERMISSIONS.SHIPPING_TICKET,
                    name: 'shipping-tickets',
                    link: '/routes/shipping-ticket',
                    icon: 'icon-fill-shipping-ticket',
                    class: '',
                },
                {
                    id: 'buyers',
                    tag: CONSTANTS.PERMISSIONS.BUYERS,
                    name: 't-buyers',
                    link: '/routes/buyers',
                    icon: 'icon-buyers',
                    class: '',
                },
            ],
            "administration": [
                {
                    id: 'dashboard',
                    name: 'dashboard',
                    link: '/routes/t-dashboard',
                    icon: 'icon-dashboard',
                    class: '',
                },
                {
                    id: 'drivers',
                    tag: CONSTANTS.PERMISSIONS.DRIVERS,
                    name: 'drivers',
                    link: '/routes/drivers',
                    icon: 'icon-conductores',
                    class: '',
                },
                {
                    id: 'trucks',
                    tag: CONSTANTS.PERMISSIONS.TRUCKS,
                    name: 'vehicles',
                    link: '/routes/trucks',
                    icon: 'icon-transportistas',
                    class: '',
                },
                {
                    id: 'measurementUnits',
                    tag: CONSTANTS.PERMISSIONS.MEASUREMENT_UNITS,
                    name: 'unit-measures',
                    link: '/routes/unit-measures',
                    icon: 'icon-unit-2',
                    class: '',
                },
                {
                    id: 'seals',
                    tag: CONSTANTS.PERMISSIONS.SEALS,
                    name: 'seals',
                    link: '/routes/seals',
                    icon: 'icon-sellos1',
                    class: '',
                },
                {
                    id: 'warehouse',
                    tag: CONSTANTS.PERMISSIONS.WAREHOUSE,
                    name: 'warehouse',
                    link: '/routes/warehouse',
                    icon: 'icon-almacen',
                    class: '',
                },
                {
                    id: 'commodity',
                    tag: CONSTANTS.PERMISSIONS.COMMODITIES,
                    name: 'commodityM',
                    link: '/routes/commodity',
                    icon: 'icon-materia-prima',
                    class: '',
                },
                {
                    id: 'transformationTypes',
                    tag: CONSTANTS.PERMISSIONS.TRANSFORMATION_TYPES,
                    link: '/routes/transformation-types',
                    name: 'transformation-types',
                    icon: 'icon-tranformaciones',
                    class: '',
                },
                {
                    id: 'scales',
                    tag: CONSTANTS.PERMISSIONS.IOTS,
                    link: '/routes/iot-devices',
                    name: 'iot-devices',
                    icon: 'icon-io-t',
                    class: '',
                },
                {
                    id: 'workflow',
                    tag: CONSTANTS.PERMISSIONS.WORKFLOW,
                    name: 'production-flows',
                    link: '/routes/workflow',
                    icon: 'icon-procesos',
                    class: '',
                },
                {
                    id: 'users',
                    name: 'users',
                    link: '/routes/users',
                    icon: 'icon-usuarios',
                    class: '',
                },
            ],
            "inventory-movements": [
                {
                    id: 'dashboard',
                    name: 'dashboard',
                    link: '/routes/t-dashboard',
                    icon: 'icon-dashboard',
                    class: '',
                },
                {
                    id: 'warehouseTransfer',
                    tag: CONSTANTS.PERMISSIONS.WAREHOUSE_TRANSFER,
                    name: 'warehouse-transfer',
                    link: '/routes/warehouse-transfer',
                    icon: 'icon-wharehouse-transfer',
                    class: ''
                }

            ]
        },
    },
};
