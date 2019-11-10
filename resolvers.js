const user = {
  _id: '1',
  name: 'tuxi',
  email: 'tuxi@lgdweb.fr',
  picture: 'https://cloudinary.com/picture'
}

module.exports = {
  Query: {
    me: () => user
  }
}
