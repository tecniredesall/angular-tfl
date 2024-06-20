import * as utils from '../../Utils/utils'

describe('Crear nota de peso ', () => {

    before(() => { });

    beforeEach(() => {
        cy.visit('/')
        cy.loginSuccess()
        cy.fixture("shared/headers").then((header) => {
            cy.get(header.weighNote).should('contain', " Nota de recepción / Lotes ")
        })
        cy.intercept('GET', '**api/web/commoditiesTransformation*').as('commoditiesTransformation');
    });
    afterEach(() => { cy.saveLocalStorage(); })

    it('Crear una nota de recepcion con 1 Nota de peso', () => {
        let url = Cypress.config('urlWeightNote')
        cy.visit({ url: url })
        crearNotaDePeso(false, 1);
    });

    it('Crear una nota de recepcion con 2 Nota de peso', () => {
        let url = Cypress.config('urlWeightNote')
        cy.visit({ url: url })
        crearNotaDePeso(false,1);
    });

    it('Crear una nota de recepcion con 3 Nota de peso', () => {
        let url = Cypress.config('urlWeightNote')
        cy.visit({ url: url })
        crearNotaDePeso(false,1);
    });

    it('Crear una nota de recepcion con Random(1,6) Nota de peso', () => {
        let url = Cypress.config('urlWeightNote')
        cy.visit({ url: url })
        cy.wait('@commoditiesTransformation')
        crearNotaDePeso(false,1);
    });

})

function crearNotaDePeso(isRandom = false, numberWeightNote = 0) {

    cy.fixture("weightNote/weight-note").then((notaPeso) => {

        cy.intercept('POST', '**/api/web/weightNotes').as('weightNotes');
        cy.intercept('PUT', '**/api/web/weightNotes/*').as('weightNotesId');
        cy.intercept('POST', '**/changeStatusNotes').as('changeStatusNotes');
        cy.intercept('GET', '**/api/web/trucks').as('trucks');
        cy.intercept('GET', '**/api/web/drivers').as('drivers');

        cy.ngSelectFirst(notaPeso.season, "")
        cy.wait(200)
        cy.randomCustomSelect(notaPeso.producer)
        cy.get("[formcontrolname=" + notaPeso.fieldTicket + "]").type(utils.generateString(6))
        cy.get(notaPeso.btnCaptureWeight).click();
        numberWeightNote = isRandom ? utils.getRandomInt(1, 6) : numberWeightNote
        cy.log(":::::::::numberWeightNote::::::::", numberWeightNote)
        for (var index = 0; index < numberWeightNote; index++) {
            var totalRows = utils.getRandomInt(1, 5);
            for (var i = 0; i < totalRows; i++) {

                cy.get(notaPeso.inputSacks).eq(i).type( utils.getRandomInt(1, 3))
                cy.get(notaPeso.inputGrossWeight).eq(i).type( utils.getRandomInt(5, 10))
                if (i < totalRows - 1)
                    cy.get(notaPeso.btnAddWeight).click();
            }
            cy.ngSelectRandom(notaPeso.commodityType)
            cy.wait(500)
            cy.ngSelectRandom(notaPeso.container)
            cy.wait(500)
            cy.ngSelectRandom(notaPeso.choiceDeduction)
            cy.randomCustomSelect(notaPeso.driver)
            cy.randomCustomSelect(notaPeso.truck)
            cy.get(notaPeso.btnClosWeightNote).click();
            index == 0 ? cy.wait('@weightNotes') : cy.wait('@weightNotesId');
            cy.wait('@changeStatusNotes');

            cy.fixture("shared/notifiers").then((notifier) => {
                cy.get(notifier.notifier).should('contain', 'La nota de peso se ha cerrado con éxito');
            })

            if (index < numberWeightNote - 1)
                cy.get(notaPeso.btnAddWeightNote).click();

            if (index == numberWeightNote - 1) {
                cy.get(notaPeso.btnCloseReceivingNote).scrollIntoView()
                cy.get(notaPeso.btnCloseReceivingNote).click({ force: true });
                cy.fixture("shared/notifiers").then((notifier) => {
                    cy.wait('@changeStatusNotes');
                    cy.get(notifier.notifier).should('contain', 'La nota de recepción se ha cerrado éxito');
                })
            }
            cy.wait(1000)
        }

    })
    return true

}

