Cypress.Commands.add('randomCustomSelect' ,  (formControlName) => {
    cy.get('[formcontrolname="'+formControlName+'"]').then((selects) => {
        cy.log("select", selects)
        let select = selects[0]; // we want just first one
        cy.wrap(select) // allows us to click using cypress
            .click()
            .get(".custom-select-dropdown") // get the opened drop-down panel
            .get(".custom-select-item").then((values) =>{ cy.log("options", values[0] , "index" , getRandomInt(0, values.length-1))
             cy.wrap(values[getRandomInt(0, values.length-1)]).click();
            })
    })
})

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

