
Cypress.Commands.add('input',(input, value) => {
    cy.get('[formcontrolname="'+input+'"]').type(value)
})


Cypress.Commands.add('getInput',(input) => {
    cy.get('[formcontrolname="'+input+'"]')
})
