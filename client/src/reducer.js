const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'LOGIN_USER': {
      return {
        ...state,
        currentUser: payload
      }
    }
    case 'IS_LOGGED_IN': {
      return {
        ...state,
        isAuth: payload
      }
    }
    case 'LOGOUT_USER': {
      return {
        ...state,
        currentUser: null,
        isAuth: false
      }
    }
    case 'CREATE_DRAFT': {
      return {
        ...state,
        currentPin: null,
        draft: {
          longitude: 0,
          latitude: 0
        }
      }
    }
    case 'UPDATE_DRAFT_LOCATION': {
      return {
        ...state,
        draft: payload
      }
    }
    case 'DELETE_DRAFT': {
      return {
        ...state,
        draft: null
      }
    }
    case 'GET_ALL_PINS': {
      return {
        ...state,
        pins: payload
      }
    }
    case 'CREATE_PIN': {
      const newPin = payload
      const prevPins = state.pins.filter(pin => pin.id !== newPin.id)
      return {
        ...state,
        pins: [...prevPins, newPin]
      }
    }
    case 'CLEAR_CURRENT_PIN': {
      return {
        ...state,
        currentPin: null
      }
    }
    case 'SET_PIN': {
      return {
        ...state,
        currentPin: payload,
        draft: null
      }
    }
    case 'DELETE_PIN': {
      const deletedPin = payload
      const filteredPins = state.pins.filter(pin => pin.id !== deletedPin.id)
      return {
        ...state,
        currentPin: null,
        pins: filteredPins
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
