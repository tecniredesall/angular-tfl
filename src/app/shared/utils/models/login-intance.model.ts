/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: Login inntance type model
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
export class LoginInstanceModel {
    email: string;
    who: string;

    constructor(email: string, who: string) {
        this.email = email;
        this.who = who
    }
}
