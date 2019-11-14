import React from 'react'
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone'

const PinIcon = ({ size, color, onClick }) => (
  <PlaceTwoTone style={{ fontSize: size, color }} onClick={onClick} />
)

export default PinIcon
