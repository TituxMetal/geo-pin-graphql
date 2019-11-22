const { AuthenticationError } = require('apollo-server')
const Pin = require('./models/Pin')

const authenticated = next => (_root, _args, context, _info) => {
  if (!context.currentUser) {
    throw new AuthenticationError('You must be logged in!')
  }

  return next(_root, _args, context, _info)
}

module.exports = {
  Query: {
    me: authenticated((_root, _args, context, _info) => context.currentUser),
    getPins: async (_root, _args, _context, _info) => {
      const pins = await Pin.find().populate('author').populate('comments.author')

      return pins
    }
  },
  Mutation: {
    createPin: authenticated(async (_root, { input }, { currentUser }, _info) => {
      const newPin = await new Pin({
        ...input,
        author: currentUser.id
      }).save()

      const pinAdded = await Pin.populate(newPin, 'author')

      return pinAdded
    }),
    deletePin: authenticated(async (_root, { pinId }, { currentUser }, _info) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: pinId }).exec()

      return pinDeleted
    })
  }
}
