describe('Blog', function() { // Mocha (used by Cypress) recommends to not use arrow functions since they can cause problem in certain situations
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
  
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset') // reset the database through a POST request to the API
    cy.request('POST', 'http://localhost:3001/api/users', user1) // create a new user through a POST request to the API
    cy.request('POST', 'http://localhost:3001/api/users', user2)

    cy.visit('http://localhost:3000') // go to the main page
  })
  
  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeds with correct credentials', function() {
      cy.get('#username').type(user1.username) // type to the field with id 'username'
      cy.get('#password').type(user1.password)
      cy.get('#login-button').click() // press the button with id 'login-button'

      cy.contains('Successfully logged in as eerojala')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type(user1.username) // type user1's username
      cy.get('#password').type(user2.password) // type user2's password
      cy.get('#login-button').click()

      cy.contains('Invalid username or password')
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)') // the notification should be red (colors must be inputted as rgb values for cypress)
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
     cy.login(user1) // command login is defined in cypress/support/commands.js
    })

    it('a blog can be added', function() {
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
        const blog = {
          title: 'This blog was added by user eerojala',
          author: 'John Doe',
          url: 'www.wikipedia.com',
          likes: 0
        }

        cy.createBlog(blog)
        cy.visit('http://localhost:3000')
      })

      it('a blog can be liked', function() {
        cy.contains('show').click() // click to show the details of the first blog
        cy.get('#likes').contains('0') // first likes are at 0
        cy.get('#like-button').click() // press the like button
        cy.get('#likes').contains('1') // likes are now at 1
        cy.get('#like-button').click()
        cy.get('#likes').contains('2') // likes are now at 2
      })

      it('a blog can be removed by the user who originally added it', function() {
        // the currently logged in user is the one who added the initial blog to the database
        cy.get('html').should('contain', 'This blog was added by user eerojala') // the blog should be rendered on the page
        cy.contains('show').click() // click to show the details of the first blog
        cy.get('#remove-button').click() // click the remove button
        cy.get('html').should('not.contain', 'This blog was added by user eerojala') // the blog should not be rendered anymore
      })

      it('a blog cannot be removed by the user who did not originally add it', function() {
        cy.login(user2) // login as user2, who is not the user who originally added the initial blog
        cy.visit('http://localhost:3000') // refresh the page since we have now logged in as another user
        cy.contains('show').click() // click to show the details of the first blog
        cy.get('#remove-button').should('not.exist') // the button should not exist for other users than the one who originally added the blog
      }) 
    })

    describe('and the database contains several blogs', function () {
      beforeEach(function() {
        cy.createBlog({ title: 'blog1', author: 'author1', url: 'url1', likes: 0 }) // command createBlog is defined in cypress/support/commands.js
        cy.createBlog({ title: 'blog2', author: 'author2', url: 'url2', likes: 2 })
        cy.createBlog({ title: 'blog3', author: 'author3', url: 'url3', likes: 1 })
        cy.visit('http://localhost:3000')
      })

      it('the blogs are sorted in decending order based on their likes', function() {
        // this works too, but is more ugly:
        // cy.get('#blog').should('contain', 'blog2 author2')
        // cy.get('#blog').next().should('contain', 'blog3 author3')
        // cy.get('#blog').next().next().should('contain', 'blog1 author1')

        cy.get('.blog').then(blogs => { // NOTE: do not use ids for checking multiple elements (get(#id) always returns only one element), use classes instead
          cy.wrap(blogs[0]).should('contain', 'blog2 author2') // blogs is a promise, we can get access to it's resolved value by giving it to function cy.wrap
          cy.wrap(blogs[1]).should('contain', 'blog3 author3') // these are testing inside the individual blog-element, so they cannot see the text in other blog elements
          cy.wrap(blogs[2]).should('contain', 'blog1 author1')
        })
      })
    })
  })
})