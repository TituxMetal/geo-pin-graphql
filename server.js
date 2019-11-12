const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => process.stdout.write('Db connected!'))
  .catch((error) => process.stdout.write(error))

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => process.stdout.write(`Server listening on ${url}`))
