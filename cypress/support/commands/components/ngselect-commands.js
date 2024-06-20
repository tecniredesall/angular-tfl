Cypress.Commands.add('ngSelect', (formControlName, value)=>{
    cy.get('[formcontrolname="'+formControlName+'"]').then((selects) => {
        cy.log("select", selects)
        let select = selects[0]; // we want just first one
        cy.wrap(select) // allows us to click using cypress
            .click()
            .get("ng-dropdown-panel") // get the opened drop-down panel
            .get(".ng-option") // Get all the options in drop-down
            .contains(value) // Filter for just this text
            .then((item) => {
                cy.wrap(item).click();
            })
    })
})

Cypress.Commands.add('ngSelectFirst', (formControlName, value)=>{
    cy.get('[formcontrolname="'+formControlName+'"]').then((selects) => {
        cy.log("select", selects)
        let select = selects[0]; // we want just first one
        cy.wrap(select) // allows us to click using cypress
            .click()
            .get("ng-dropdown-panel") // get the opened drop-down panel
            .get(".ng-option") // Get all the options in drop-down
            .eq(0) // Filter for just this text
            .then((item) => {
                cy.wrap(item).click();
            })
    })
})

Cypress.Commands.add('ngSelectAtIndex', (formControlName, index)=>{
    cy.get('[formcontrolname="'+formControlName+'"]').then((selects) => {
        cy.log("select", selects)
        let select = selects[0]; // we want just first one
        cy.wrap(select) // allows us to click using cypress
            .click()
            .get("ng-dropdown-panel") // get the opened drop-down panel
            .get(".ng-option") // Get all the options in drop-down
            .eq(index) // Filter for just this text
            .then((item) => {
                cy.wrap(item).click();
            })
    })
})


Cypress.Commands.add('ngSelectRandom', (formControlName)=>{
    cy.get('[formcontrolname="'+formControlName+'"]').then((selects) => {
        cy.log("select", selects)
        let select = selects[0]; // we want just first one
        cy.wrap(select) // allows us to click using cypress
            .click()
            .get("ng-dropdown-panel") // get the opened drop-down panel
            .find(".ng-option").then((values) =>{
            console.log(".ng-option",values)
             cy.wrap(values[getRandomInt(0, values.length-1)]).click();
            })
    })
})

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
