import React, { useContext } from 'react'
import { GoogleLogin } from 'react-google-login'
import { GraphQLClient } from 'graphql-request'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import Context from '../../context'
import meQuery from '../../graphql/queries'

const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID
const graphqlUri = process.env.REACT_APP_GRAPHQL_URI

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token
      const client = new GraphQLClient(graphqlUri, {
        headers: {
          authorization: idToken
        }
      })
      const { me } = await client.request(meQuery)
      dispatch({ type: 'LOGIN_USER', payload: me })
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() })
    } catch (error) {
      onFailure(error)
    }
  }

  const onFailure = error => { throw new Error('Error logging in', error) }

  return (
    <div className={classes.root}>
      <Typography component='h1' variant='h3' gutterBottom noWrap>
        Welcome to GeoPin
      </Typography>
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        buttonText='Login with Google'
        theme='dark'
        isSignedIn
      />
    </div>
  )
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
