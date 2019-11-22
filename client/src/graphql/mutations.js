export const createPinMutation = `
  mutation ($title: String!, $image: String!, $content: String!, $latitude: Float!, $longitude: Float!) {
    createPin (input: {
      title: $title,
      image: $image,
      content: $content,
      latitude: $latitude,
      longitude: $longitude
    }) {
      id
      title
      image
      content
      latitude
      longitude
      author {
        id
        name
        email
        picture
      }
    }
  }
`

export const deletePinMutation = `
  mutation ($pinId: ID!) {
    deletePin (pinId: $pinId) {
      id
    }
  }
`
