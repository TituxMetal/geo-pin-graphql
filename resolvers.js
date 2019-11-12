const { AuthenticationError } = require('apollo-server')

const authenticated = (next) => (_root, _args, context, _info) => {
  if (!context.currentUser) {
    throw new AuthenticationError('You must be logged in!')
  }

  return next(context)
}

module.exports = {
  Query: {
    me: authenticated((context) => context.currentUser)
  }
}
