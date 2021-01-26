describe('Blog', function() { // Mocha (used by Cypress) recommends to not use arrow functions since they can cause problem in certain situations
  const loginWithCorrectCredentials = function() {
    cy.get('#username').type('eerojala')
    cy.get('#password').type('salasana')
    cy.get('#login-button').click()
  }
  
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
      loginWithCorrectCredentials()

      cy.contains('Successfully logged in as eerojala')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type('eerojala')
      cy.get('#password').type('salasana1')
      cy.get('#login-button').click()

      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      loginWithCorrectCredentials()
    })

    it.only('A blog can be added', function() {
      cy.contains('Add a new blog').click()
      cy.get('#title').type('Hello World')
      cy.get('#author').type('Bram Cohen')
      cy.get('#url').type('www.google.com')
      // cy.contains('Create').click() this does not work because there is a header element before which also contains 'Create'
      cy.get('#create-button').click()

      cy.contains('Hello World Bram Cohen')
    })
  })
})