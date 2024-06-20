import * as utils from '../../Utils/utils'

describe('Crear un productos ', () => {

    before(() => { });

    beforeEach(() => {
        cy.visit('/')
        cy.loginSuccess()
        cy.fixture("shared/headers").then((header) => {
            cy.get(header.weighNote).should('contain', " Nota de recepción / Lotes ")
        })

    });
    afterEach(() => { cy.saveLocalStorage(); })

    it('Validar Identidad de un Productor', () => {
        let url = Cypress.config('urlProducers')
        cy.visit({ url: url });
        cy.fixture("producers/producer").then((producer) => {
            cy.get(producer.btnAddNew).click({ force: true });
            cy.input(producer.identity, utils.generateNumber(6));
            cy.getInput(producer.identity).should('have.class', 'ng-invalid')
            cy.get(producer.btnNext).should('be.disabled')
            cy.input(producer.identity, utils.generateNumber(13));
            cy.getInput(producer.identity).should('have.class', 'ng-valid')
            cy.get(producer.btnNext).click();
        })
    });

    it('Crear un Productor', () => {
        let url = Cypress.config('urlProducers')
        cy.visit({ url: url })

        cy.fixture("producers/producer").then((producer) => {
            cy.get(producer.btnAddNew).click({ force: true });
            cy.input(producer.identity, utils.generateNumber(6));
            cy.getInput(producer.identity).should('have.class', 'ng-invalid')
            cy.get(producer.btnNext).should('be.disabled')
            cy.input(producer.identity, utils.generateNumber(13));
            cy.getInput(producer.identity).should('have.class', 'ng-valid')
            cy.get(producer.btnNext).click();
            cy.get("app-custom-date-picker").then((pickers) => {
                for (var i = 0; i < pickers.length; i++) {
                    console.log("pickers", pickers[i])
                    cy.get(pickers[i]).find("button").click({ force: true });
                    cy.get(".mat-calendar-content").find('.mat-calendar-body-active').first().click({ force: true })
                }
            })
            crearProductor(1);
            cy.get(producer.btnNext).click();
            cy.fixture("shared/notifiers").then((notifier) => {
                cy.get(notifier.notifier).should("contain", "Los productores se han creado con éxito")
            })
        })


    });

})

function crearProductor(index) {
    let inx = index;
    cy.fixture("producers/producer").then((producer) => {

        cy.get(".sil-form").find('input[type=text]').then((inputs) => {
            for (var index = 0; index < inputs.length; index++) {
                cy.get(inputs[index]).then(($input) => {
                    console.log("input value: ", $input.val(), "input role", $input.attr("role"), "formcontrolnaame ", $input.attr("formcontrolname"))
                    if (!$input.is(':disabled') && $input.is(':visible') && $input.val() === '' || $input.val() === '0') {
                        cy.get($input).click({ force: true });
                    }
                })
            }
        })

        cy.get(".sil-form").find('[type=text]').then((inputs) => {
            for (var index = 0; index < inputs.length; index++) {
                cy.get(inputs[index]).then(($input) => {
                    if ($input.hasClass('ng-invalid') && $input.attr("role") == undefined) {
                        console.log("index", inx)
                        switch (inx) {
                            case 1:
                                cy.get($input).clear().type(utils.generateNumber(5))
                                break;
                            case 2:
                                cy.get($input).clear().type(utils.generateString(5))
                                break;
                            case 3:
                                cy.get($input).clear().type(utils.generateOnlyLetter(5))
                                break;
                            default:
                                cy.get($input).clear().type(utils.generateOnlyLetter(5))
                                break;
                        }

                    }
                })
            }
        })

        cy.get(".sil-form").find('ng-select').then((inputs) => {
            for (var index = 0; index < inputs.length; index++) {
                cy.get(inputs[index]).then(($input) => {
                    if ($input.hasClass("ng-invalid")) {
                        console.log("ngselect", $input)
                        cy.get($input).invoke("attr", "formcontrolname").then((control) => {
                            cy.ngSelectRandom(control)
                        })
                    }
                })
            }
        })

        cy.get(producer.btnNext).then(($btn) => {
            console.log("btn", $btn.is(":disabled"))
            if ($btn.is(":disabled")) {
                crearProductor(inx + 1);
            }
        })
    })
    return
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
        var totalRows = getRandomInt(1, 5);
        for (var i = 0; i < totalRows; i++) {

            cy.get(notaPeso.inputSacks).eq(i).type(utils.getRandomInt(1, 3))
            cy.get(notaPeso.inputGrossWeight).eq(i).type(utils.getRandomInt(5, 10))
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

    return true
}
