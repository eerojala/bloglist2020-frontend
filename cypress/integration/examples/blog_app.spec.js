describe('Blog', function() { // Mocha (used by Cypress) recommends to not use arrow functions since they can cause problem in certain situations
  beforeEach(function() {
    const user = {
      name: 'Eero Ojala',
      username: 'eerojala',
      password: 'salasana'
    }

    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })
  
  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeds with correct credentials', function() {
      cy.get('#username').type('eerojala')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Successfully logged in as eerojala')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type('eerojala')
      cy.get('#password').type('salasana1')
      cy.get('#login-button').click()

      cy.contains('Invalid username or password')
    })
  })
})