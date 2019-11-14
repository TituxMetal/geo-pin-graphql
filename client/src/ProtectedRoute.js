import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import Context from './context'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context)
  const render = props => (!state.isAuth ? <Redirect to='/login' /> : <Component props={props} />)

  return (
    <Route
      render={render}
      props={rest}
    />
  )
}

export default ProtectedRoute
