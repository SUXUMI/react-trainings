import React, { useState, useContext } from 'react'
import { Container, Col, Row, Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap'
import axios from '../services/http-service'
import { app as appConfig } from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MeContext from '../services/me-context'

const Profile = (props) => {
  const { requestMeUpdate, meState, setMeState } = props

  const { me } = useContext(MeContext)

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [values, setValue] = useState({ ...me, password: ''})

  const setMyValue = event => {
    const name = event.target.name
    const value = event.target.value

    setValue({
      ...values,
      [name]: value
    })
  }
  
  const submit = async event => {
    event.preventDefault()

    setSubmitting(true);

    try {
      const result = await axios.post(
        appConfig.meUrl,
        values
      )

      //const {token} = result.data.data

      setSuccessMessage('Updated')
      
      setValue({
        ...values,
        password: ''
      })

      requestMeUpdate(meState, setMeState)
    }
    catch (e) {
      try {
        const { error } = e.response.data
        setError(error)
      }
      catch(e) {
        setError(e.message)
      }
    }
    finally {
      setSubmitting(false)
    }

    setTimeout(() => { setError('') }, 3000)
    setTimeout(() => { setSuccessMessage('') }, 2000)
  }

  return (
    <MeContext.Provider value={meState}>
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }} className="p-3">
            <Form onSubmit={submit}>
              {successMessage && (<Alert color="success">{successMessage}</Alert>)}
              {error && (<Alert color="danger">{error}</Alert>)}

              <FormGroup>
                <Label>Firstname</Label>
                <Input name="firstName" value={values.firstName} onChange={setMyValue} placeholder="firstname" required />
              </FormGroup>

              <FormGroup>
                <Label>Lastname</Label>
                <Input name="lastName" value={values.lastName} onChange={setMyValue} placeholder="lastName" required />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={values.email} onChange={setMyValue} placeholder="email" required />
              </FormGroup>

              <FormGroup>
                <Label>Update Password</Label>
                <Input name="password" type="password" value={values.password} onChange={setMyValue} placeholder="password" />
              </FormGroup>

              <Button disabled={submitting}>
                {submitting ? <span><FontAwesomeIcon icon="spinner" size="sm" spin title="loading.." /> Updating..</span> : 'Update'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </MeContext.Provider>
  )
}

export default Profile
