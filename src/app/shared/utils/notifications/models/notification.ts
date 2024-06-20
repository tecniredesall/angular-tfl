/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/10/04
 * Description: Notification interfaz, define all properties
 * Updated:
 * Comments:
 * Version: 2019.10.04.1335
 * Code created by: Grain Chain
 */
export interface NotificationModel {
    type: string;  // type if our alert. It may be 'success, danger, infor'
    time: number;   // life time of alert
    message: string;   // Message that we want to show in alert
}
