import React, { useContext } from 'react'
import { GoogleLogin } from 'react-google-login'
import { GraphQLClient } from 'graphql-request'
import { withStyles } from '@material-ui/core/styles'
// import Typography from "@material-ui/core/Typography"

import Context from '../../context'

const ME_QUERY = `
  query {
    me {
      _id
      name
      email
      picture
    }
  }
`
const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID
const graphqlUri = process.env.REACT_APP_GRAPHQL_URI

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token
    const client = new GraphQLClient(graphqlUri, {
      headers: {
        authorization: idToken
      }
    })
    const data = await client.request(ME_QUERY)
    dispatch({ type: 'LOGIN_USER', payload: data.me })
  }

  return <GoogleLogin clientId={clientId} onSuccess={onSuccess} isSignedIn />
}

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
}

export default withStyles(styles)(Login)
