const { AuthenticationError } = require('apollo-server')
const { OAuth2Client } = require('google-auth-library')

const User = require('../models/User')

const oauthClientId = process.env.OAUTH_CLIENT_ID

const client = new OAuth2Client(oauthClientId)

exports.findOrCreateUser = async (token) => {
  if (!token) {
    throw new AuthenticationError('No auth token provided!')
  }
  const googleUser = await verifyAuthToken(token)
  const user = await checkIfUserExists(googleUser.email)

  return user || createNewUser(googleUser)
}

const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: oauthClientId
    })

    return ticket.getPayload()
  } catch (err) {
    throw new Error('Error verifying auth token', err)
  }
}

const checkIfUserExists = (email) => User.findOne({ email }).exec()

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser
  const user = { name, email, picture }

  return new User(user).save()
}
