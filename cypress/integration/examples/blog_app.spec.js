describe('Blog', function() { // Mocha (used by Cypress) recommends to not use arrow functions since they can cause problem in certain situations
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  
  it('login form is shown', function() {
    cy.contains('Log in to application')
  })
})