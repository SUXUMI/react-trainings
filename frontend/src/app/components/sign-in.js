import React, { useState } from 'react'
// import styled from 'styled-components'
import { Container, Col, Row, Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap'
import axios from '../services/http-service'
import { app as appConfig } from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MeContext from '../services/me-context'

const SignIn = (props) => {
  const { requestMeUpdate, meState, setMeState } = props

  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [values, setValue] = useState({email: '', password: ''})

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
        appConfig.signInUrl,
        values
      )

      const {token} = result.data.data

      localStorage.setItem('token', token)

      // setMeState({
      //   me: {firstName: 'testi', lastName: 'ltesti'},
      //   loaded: true,
      // })

      requestMeUpdate(meState, setMeState)

      setLoggedIn(true)
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

      setValue({
        ...values,
        password: ''
      })
    }

    setTimeout(() => { setError('') }, 3000)
  }

  return (
    <MeContext.Provider value={meState}>
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }} className="p-3">
            <Form onSubmit={submit}>
              {loggedIn && (<Alert color="success">You have logged in successfully</Alert>)}
              {error && (<Alert color="danger">{error}</Alert>)}

              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={values.email} onChange={setMyValue} placeholder="email" required />
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <Input name="password" type="password" value={values.password} onChange={setMyValue} placeholder="password" required />
              </FormGroup>

              <Button disabled={submitting}>
                {submitting ? <span><FontAwesomeIcon icon="spinner" size="sm" spin title="loading.." /> Logging..</span> : 'Log in'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </MeContext.Provider>
  )
}

export default SignIn
