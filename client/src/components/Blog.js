import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import Context from '../context'
import CreatePin from './Pin/CreatePin'
import NoContent from './Pin/NoContent'
import PinContent from './Pin/PinContent'

const Blog = ({ classes }) => {
  const { state } = useContext(Context)
  const { draft, currentPin } = state

  return (
    <Paper className={classes.root}>
      {draft && !currentPin && <CreatePin />}
      {!draft && currentPin && <PinContent />}
      {!draft && !currentPin && <NoContent />}
    </Paper>
  )
}

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  },
  rootMobile: {
    maxWidth: '100%',
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'scroll'
  }
}

export default withStyles(styles)(Blog)
