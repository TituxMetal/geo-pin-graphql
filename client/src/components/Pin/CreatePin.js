import React, { useState, useContext } from 'react'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone'
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/SaveTwoTone'

import Context from '../../context'
import { createPinMutation } from '../../graphql/mutations'
import useGqlClient from '../../hooks/useGqlClient'

const CreatePin = ({ classes }) => {
  const client = useGqlClient()
  const { state, dispatch } = useContext(Context)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const disabled = !title.trim() || !content.trim() || !image || submitting

  const handleImageUpload = async () => {
    const formData = new FormData()

    formData.append('file', image)
    formData.append('upload_preset', 'geopin')
    formData.append('cloud_name', 'tuximetal-geopin')

    const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)

    return data.url
  }

  const handleSubmit = async event => {
    try {
      event.preventDefault()
      setSubmitting(true)
      const imgUrl = await handleImageUpload()
      const { latitude, longitude } = state.draft
      const variables = { title, image: imgUrl, content, latitude, longitude }
      const { createPin } = await client.request(createPinMutation, variables)

      handleDeleteDraft()
      dispatch({ type: 'CREATE_PIN', payload: createPin })
    } catch (error) {
      setSubmitting(false)
    }
  }

  const handleDeleteDraft = () => {
    setTitle('')
    setContent('')
    setImage('')
    dispatch({ type: 'DELETE_DRAFT' })
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} />
        Pin Location
      </Typography>
      <section>
        <TextField onChange={e => setTitle(e.target.value)} name='title' label='Title' placeholder='Insert pin title' />
        <label htmlFor='image'>
          <input
            onChange={e => setImage(e.target.files[0])}
            accept='image/*'
            id='image'
            type='file'
            className={classes.input}
          />
          <Button style={{ color: image && 'green' }} component='span' size='small' className={classes.button}>
            <AddAPhotoIcon />
          </Button>
        </label>
      </section>
      <section className={classes.contentField}>
        <TextField
          onChange={e => setContent(e.target.value)}
          name='content'
          label='Content'
          margin='normal'
          variant='outlined'
          rows='6'
          fullWidth
          multiline
        />
      </section>
      <section>
        <Button onClick={handleDeleteDraft} className={classes.button} variant='contained' color='primary'>
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          onClick={handleSubmit}
          className={classes.button}
          disabled={disabled}
          type='submit'
          variant='contained'
          color='secondary'
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </section>
    </form>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    width: '100%'
  },
  input: {
    display: 'none'
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
})

export default withStyles(styles)(CreatePin)
