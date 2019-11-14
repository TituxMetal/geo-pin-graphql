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
    default: {
      return state
    }
  }
}

export default reducer
