export const meQuery = `
  query {
    me {
      id
      name
      email
      picture
    }
  }
`

export const getPinsQuery = `
  query {
    getPins {
      id
      title
      content
      image
      latitude
      longitude
      createdAt
      author {
        id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          id
          name
          picture
        }
      }
    }
  }
`
