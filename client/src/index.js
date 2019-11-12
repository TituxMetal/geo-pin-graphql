import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'mapbox-gl/dist/mapbox-gl.css'

import Context from './context'
import reducer from './reducer'
import App from './pages/App'
import Splash from './pages/Splash'

import * as serviceWorker from './serviceWorker'

const Root = () => {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Router>
      <Context.Provider value={{ state, dispatch }}>
        <Switch>
          <Route exact path='/' component={App} />
          <Route path='/login' component={Splash} />
        </Switch>
      </Context.Provider>
    </Router>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
serviceWorker.unregister()
