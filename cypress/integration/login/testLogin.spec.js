

describe('login' , function () {

    beforeEach( ()=>{
        cy.visit('/')
    } )

    it('Validate login using password incorrect', () => {
        var dataTest ={ email :"admin@grainchain.io", password:"Pass1234;;" }
        cy.login(dataTest)
        cy.fixture("shared/notifiers").then((content) => {
            cy.get(content.content).should('contain', "Tu contraseña es incorrecta")
        })
    });


    it('Validate login using user incorrect', () => {
        var dataTest ={ email :"_admin@grainchain.io", password:"Pass1234;" }
        cy.login(dataTest)
        cy.fixture("shared/notifiers").then((content) => {
            cy.get(content.content).should('contain', "not found")
        })
    });

    it('Validate login using user correct', () => {
        cy.log(Cypress.config('user'))
        var dataTest ={ email :"admin@grainchain.io", password:"Pass1234;" }
        cy.login(dataTest)
        cy.fixture("shared/headers").then((header) => {
            cy.get(header.weighNote).should('contain', " Nota de recepción / Lotes ")
        })
    });

    afterEach(() => {
        cy.saveLocalStorage();
      });

})
