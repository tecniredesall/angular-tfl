describe('Crear Lote', () => {

    before(() => {
        cy.visit('/')
        cy.loginSuccess()
        cy.fixture("shared/headers").then((header) => {
            cy.get(header.weighNote).should('contain', " Nota de recepción / Lotes ")
        })
    })

    beforeEach(() => { })

    afterEach(() => { cy.saveLocalStorage();  })

    it('Test Crear Lotes', () => {
        let url = Cypress.config('urlLot')
        cy.visit({ url: url })
        cy.fixture("lots/filterNewLote").then((filter) => {
            cy.ngSelectFirst(filter.commodity, "Coffe")
            cy.ngSelectAtIndex(filter.commodityType, 3)
            cy.ngSelect(filter.warehouse, "Prueba")
        })
        cy.wait(3000)

        // cy.get(".table-body").then( (rows) => {
        //    cy.wrap(rows).get('.notes-grid').then((values) => {
        //        let rowSelected = values[0]
        //        console.log("row", rowSelected)
        //         cy.get(rowSelected).find('.first-column-table').then((first) => {
        //             console.log("first", first)
        //             cy.get(first[0]).find('.weight-note__checkbox').then( (check) => {
        //                 console.log("check", check)
        //                 cy.get(check).find('input').click({force:true})
        //             })
        //         })
        //         //get('.weight-note__checkbox').find('input').click({force:true})
        //    })
        // })

        cy.lotListTable()

        // cy.get('#ch1').find('input').click({force:true});
         cy.fixture("lots/newLote").then( (items) => {
             cy.get(items.siguiente).click();
             cy.get("#flow0").click();
             cy.get(items.siguiente).click();
             //cy.get(items.siguiente).click();
         })
        // cy.wait(500)
        // cy.fixture("shared/notifiers").then( (notifier) => {
        //     cy.get(notifier.notifier).should('contain' , 'se han creado con éxito' )
        // })

    });
})
