import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExploreIcon from '@material-ui/icons/Explore'
import Typography from '@material-ui/core/Typography'

const NoContent = ({ classes }) => (
  <section className={classes.root}>
    <ExploreIcon className={classes.icon} />
    <Typography
      noWrap
      gutterBottom
      component='h2'
      variant='h6'
      align='center'
      color='textPrimary'
    >
      Click on the map to add a pin
    </Typography>
  </section>
)

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: '80px'
  }
})

export default withStyles(styles)(NoContent)
