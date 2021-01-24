module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true 
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "rules": {
    "react/prop-types": "off"
  },
  "plugins": [
      "react", "jest"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}