import { useState, useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'

export const graphqlUri = process.env.REACT_APP_GRAPHQL_URI

const useGqlClient = () => {
  const [idToken, setIdToken] = useState('')

  useEffect(() => {
    if (window && window.gapi) {
      const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
      setIdToken(token)
    }
  }, [])

  return new GraphQLClient(graphqlUri, { headers: { authorization: idToken } })
}

export default useGqlClient
