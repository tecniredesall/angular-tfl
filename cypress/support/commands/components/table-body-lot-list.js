Cypress.Commands.add('lotListTable', () => {
    cy.get(".table-body").then((rows) => {
        cy.wrap(rows).get('.notes-grid').find('.first-column-table').find('.notes-item').parent().then((values) => {
            let itemSelected = getRandomInt(1,values.length-1)
            console.log("itemSelected",itemSelected)
            for (var index = 0; index < itemSelected; index++) {
                let rowSelected = values[index]
                console.log("row",rowSelected)
                cy.get(rowSelected).find('mat-checkbox').find('input').then((check) => {
                    cy.get(check[0]).click({ force: true })
                 })
                // cy.get(rowSelected).find('.first-column-table').then((first) => {
                //     console.log("first", first)
                //     cy.get(first[0]).find('.weight-note__checkbox').then((check) => {
                //         console.log("check", check)
                //         cy.get(check).find('input').click({ force: true })
                //     })
                // })
            }

        })
    })
})

function getRandomInt(min, max) {
    console.log("rangos" ,min,max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
