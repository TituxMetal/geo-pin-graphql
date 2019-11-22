import React, { useState, useEffect, useContext, useCallback } from 'react'
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl'
import differenceInMinutes from 'date-fns/difference_in_minutes'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'

import Blog from './Blog'
import PinIcon from './PinIcon'
import Context from '../context'
import useGqlClient from '../hooks/useGqlClient'
import { getPinsQuery } from '../graphql/queries'
import { deletePinMutation } from '../graphql/mutations'

const initialViewport = {
  latitude: 37.75,
  longitude: -122.43,
  zoom: 13
}

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context)
  const [viewport, setViewport] = useState(initialViewport)
  const [userPosition, setUserPosition] = useState(null)
  const [popup, setPopup] = useState(null)
  const client = useGqlClient()

  const getAllPins = useCallback(async () => {
    const { getPins } = await client.request(getPinsQuery)
    dispatch({ type: 'GET_ALL_PINS', payload: getPins })
  }, [])

  useEffect(() => {
    getAllPins()
  }, [getAllPins])

  const getUserPosition = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport(vport => ({ ...vport, latitude, longitude }))
        setUserPosition({ latitude, longitude })
      })
    }
  }, [])

  useEffect(() => {
    getUserPosition()
  }, [getUserPosition])

  const handleDeletePin = async pin => {
    const variables = { pinId: pin.id }
    const { deletePin } = await client.request(deletePinMutation, variables)

    dispatch({ type: 'DELETE_PIN', payload: deletePin })
    setPopup(null)
  }

  const handleMapClick = ({ target, lngLat, leftButton }) => {
    if (!leftButton || target.childNodes.length < 1) return

    if (popup) {
      setPopup(null)
    }

    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' })
    }

    const [longitude, latitude] = lngLat

    dispatch({ type: 'UPDATE_DRAFT_LOCATION', payload: { longitude, latitude } })
  }

  const handleClosePopup = () => {
    setPopup(null)
    dispatch({ type: 'CLEAR_CURRENT_PIN' })
  }

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30

    return isNewPin ? 'limegreen' : 'darkblue'
  }

  const handleSelectPin = pin => {
    setPopup(pin)
    dispatch({ type: 'SET_PIN', payload: pin })
  }

  const isAuthUser = () => state.currentUser.id === popup.author.id

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='orangered' />
          </Marker>
        )}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='hotpink' />
          </Marker>
        )}
        {state.pins.map(pin => (
          <Marker
            key={pin.id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={highlightNewPin(pin)} onClick={() => handleSelectPin(pin)} />
          </Marker>
        ))}
        {popup && (
          <Popup anchor='top' latitude={popup.latitude} longitude={popup.longitude} closeOnClick={false} onClose={handleClosePopup}>
            <img className={classes.popupImage} src={popup.image} alt={popup.title} />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}
                ,
                {' '}
                {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Blog />
    </div>
  )
}

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}

export default withStyles(styles)(Map)
