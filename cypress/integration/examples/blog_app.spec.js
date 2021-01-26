describe('Blog', function() { // Mocha (used by Cypress) recommends to not use arrow functions since they can cause problem in certain situations
  let user1Id
  let user2Id
  
  beforeEach(function() {
    const user1 = {
      name: 'Eero Ojala',
      username: 'eerojala',
      password: 'salasana'
    }

    const user2 = {
      name: 'Peter Parker',
      username: 'spiderman',
      password: 'excelsior'
    }

    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    
    cy.request('POST', 'http://localhost:3001/api/users', user1)
      .then(response => {
        user1Id = response.body.id
      })

    
    cy.request('POST', 'http://localhost:3001/api/users', user2)
      .then(response => {
        user2Id = response.body.id
      })

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

  describe('When logged in', function() {
    beforeEach(function() {
      cy
        .request('POST', 'http://localhost:3001/api/login', { username: 'eerojala', password: 'salasana' })
        .then(response => {
          localStorage.setItem('loggedInUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
    })

    it('A blog can be added', function() {
      cy.contains('Add a new blog').click()
      cy.get('#title').type('Hello World')
      cy.get('#author').type('Bram Cohen')
      cy.get('#url').type('www.google.com')
      // cy.contains('Create').click() this does not work because there is a header element before which also contains 'Create'
      cy.get('#create-button').click()

      cy.contains('Hello World Bram Cohen')
    })

    describe('and the database contains one blog', function() {
      beforeEach(function() {
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: {
            title: 'This blog was added by user eerojala',
            author: 'John Doe',
            url: 'www.wikipedia.com'
          },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })

        cy.visit('http://localhost:3000')
      })

      it.only('a blog can be liked', function() {
        cy.contains('show').click() // click to show the details of the first blog
        cy.get('#likes').contains('0') // first likes are at 0
        cy.get('#like-button').click() // press the like button
        cy.get('#likes').contains('1') // likes are now at 1
        cy.get('#like-button').click()
        cy.get('#likes').contains('2') // likes are now at 2
      })
    })
  })
})