const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { findOrCreateUser } = require('./controllers/userController')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => process.stdout.write('Db connected!'))
  .catch(error => process.stdout.write(error))

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null
    let currentUser = null

    try {
      authToken = req.headers.authorization

      if (authToken) {
        currentUser = await findOrCreateUser(authToken)
      }
    } catch (err) {
      process.stdout.write(`Unable to authenticate user with token ${authToken}`)
    }

    return { authToken, currentUser }
  }
})

server.listen().then(({ url }) => process.stdout.write(`Server listening on ${url}`))
