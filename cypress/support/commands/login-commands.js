
import "cypress-localstorage-commands"

Cypress.Commands.add('login', (value) => {
    cy.fixture("login/login").then((login)=>{
        cy.get(login.email).type(value.email)
        cy.get(login.button).click();
        cy.get(login.password).type(value.password)
        cy.get(login.button).click();
    })
})


Cypress.Commands.add('loginSuccess', (value) => {
    cy.fixture("login/login").then((login)=>{
        cy.get(login.email).type(Cypress.config('user'))
        cy.get(login.button).click();
        cy.get(login.password).type(Cypress.config('password'))
        cy.get(login.button).click();
    })
})
