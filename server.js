const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./config')
const middleware = require('./middleware')

class HandlerGenerator {
  login (req, res) {
    const username = req.body.username
    const password = req.body.password
    // For the given username fetch user from DB
    const mockedUsername = 'admin'
    const mockedPassword = 'password'

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
                              config.secret,
                      {expiresIn: '24h'}
                              )
        // return the JWT for future API calls
        res.json({
          success: true,
          message: 'Authentication successful',
          token: token
        })
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        })
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      })
    }
  }
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    })
  }
}

function main() {
  const app = express()
  const handlers = new HandlerGenerator()
  const port = process.env.PORT || 8000
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())
  // Routes & handlers
  app.post('/login', handlers.login)
  app.get('/', middleware.checkToken, handlers.index)
  app.listen(port, () => console.log(`Server is listening on port: ${port}`))
}

main()