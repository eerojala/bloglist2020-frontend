# What I (re-)learned - part 5
### Saving the token to localStorage
Remember to save the token to userStorage after the user has logged in. This way the token can be read when the user revisits the page and they don't need to relogin. Remember to also remove the token from the local storage after the user has logged out. 

NOTE: apparently local storage will continue to persist until the user manually resets it (https://stackoverflow.com/questions/8537112/when-is-localstorage-cleared). If you do not want logins to persist for too long, you need to have some sort of expiration funcionality. Do not just rely on setTimeout, since it will cease to exist if the user exits the page and thus the token will remain on the localStorage.

Saving the token: https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
```
window.localStorage.setItem('loggedInUser', JSON.stringify(user)) // returns undefined
```

Getting the token: https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
```
const loggedInUserJSON = window.localStorage.getItem('loggedInUser') // returns null if the key doesn't exist

if (loggedInUserJSON) {
  const user = JSON.parse(loggedInUserJSON)
  setUser(user)
  blogService.setToken(user.token)
}
```

Removing the token: https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
```
window.localStorage.removeItem('loggedInUser') // returns undefined, deleting a non-existing key-value pair is harmless
```

### Effect hooks
You can use effect hooks to perform actions only at the initial render (similar to React class lifecycle method ```componentDidMount()```)
```
useEffect(() => {    
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
		if (loggedUserJSON) {      
			const user = JSON.parse(loggedUserJSON)      
			setUser(user)      
			noteService.setToken(user.token)    
		}  
	}, []) // the empty array as the second parameter ensures that the function is only ran at the initial render.
```

The array in the second parameter can be used to fire effect functions conditionally: https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect

Remember to call hooks only at the top level of a React function component (state, effect and custom hooks) https://reactjs.org/docs/hooks-overview.html
So no calling inside nest functions, loops or conditionals (if-statements and try-catch blocks)

You can also call hooks from custom hooks, but not from regular javascript functions (that are not React component functions). Fullstack open 2020 will teach about custom hooks in part 7.

### One-liner boolean toggle
No need for if-statements or conditional operators!
```
setVisible(!visible) // if visible = true then !true = false, if visible = false then !false = true
```

### Replacing a single object in an array without reordering the array 
```
// replace the old blog with the updated blog without affecting the order of the blogs
setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b)) 
```

### ObjectId
Remember that mongoose stores ids as objects, not as strings. So when you save/update a document with a field that has an id which references another document you need to either convert the id string to an ```ObjectId``` or find the document matching the id from the database and take it's ```_id``` field directly (with the latter method you also coincidentaly end up testing the validity of the id)

### Creating an object with spread syntax
```
newBlog = {...blog, likes: blog.likes + 1} // creates a new object with the same values as blog with the exception of likes 
```

### querySelector
Be careful with the syntax!
```
const div = component.container.querySelector('.togglableContent') // looks for a component with a css class of this name
const showButton = component.container.querySelector('button') // looks for a component of this type
const authorInput = component.container.querySelector('#author') // looks for a component with a matching id
```

### Testing react
By default react tests are run in watch-mode. This is fine and all but if you want to generate code coverage it will not work, so you need to turn watch mode off. You can do this in windows by typing ```set CI=true``` on the command prompt. Note that you if you want to turn watch mode again ```set CI=false``` will not work, and you need to close and reopen the command prompt again (I didn't figure out any other way)


### Cypress
https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes

Cypress commands are asynchonous and are not executed when the function is initially ran. Instead they are put on a queue to be ran later (but regular code is executed immediately, so you will end up with variables which are undefined). So use ```.then``` if you want to store result values in variables.
Do not use arrow functions or async/await in cypress, might result in unforeseen consequences.
Tests go in the folder ```cypress/integration\examples```.
Custom commands go in the file ```cypress/support/commands.js```
Test operations like logging in through the UI only once. For other test scenarios which require an user to be logged in, login through the API directly instead.

IMPORTANT!! Id-based gets like ```cy.get('#blog')``` will always return only one result. I assume HTML Id's should be unique anyway, so use ```classNames``` instead. ```cy.get('.blog')``` will return all elements which have this class selector

### mongoose .save()
```.save()``` returns the object with the fields defined in the schema plus it's newly created id in the field ```_id```. So if you save an object with additional fields that are not defined in the schema they will not be saved to the database and the object returned from```save()```will not have them.

### Jest
Do not put ```async``` in describe blocks, otherwise during tests it will print out ```Returning a Promise from “describe” is not supported. Tests must be defined synchronously```. Put asyncs only on individual tests and before/after blocks.