import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
// import { BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import HtmlHeader from './app/components/html-header'
import { Container, Col, Row } from 'reactstrap'
// import axios from './app/services/http-service'
import {links as confLinks} from './app/config'
import MeContext from './app/services/me-context'
import requestMeUpdate from './app/services/request-me-update'
import SignIn from './app/components/sign-in'
import Profile from './app/components/profile'
import Posts from './app/components/posts'
import Authors from './app/components/authors'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// import { fas, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

// library.add(far, fab)
// library.add(faUserCircle)
library.add(faSpinner)

const redirectIf = (loaded, condition, redirectTo, component) => () => {
  if (!loaded) {
    return <Container><Row><Col className="text-center p-3"><FontAwesomeIcon icon={faSpinner} size="sm" spin title="loading.." /></Col></Row></Container>
  }

  if (condition) {
    return <Redirect to={`${redirectTo}`} />
  }

  return component
}

function App() {
  const [meState, setMeState] = useState({me: false, loaded: false})

  useEffect(() => {
    requestMeUpdate(meState, setMeState)
  }, [])

  return (
      <div className="App">
        <MeContext.Provider value={meState}>
          <HtmlHeader setMeState={setMeState} />
          <Switch>
            {/* <Route exact path="/" render={() => ( <Container><div>home</div></Container> )} /> */}
            <Route exact path="/">
              <Redirect to="/posts" />
            </Route>
            <Route
              path="/sign-in"
              // render={() => <SignIn requestMeUpdate={requestMeUpdate} meState={meState} setMeState={setMeState} />}
              // component={SignIn}
              // render={redirectIfAuthorized(<SignIn />, meState)}
              // render={redirectIfAuthorized(<SignIn requestMeUpdate={requestMeUpdate} meState={meState} setMeState={setMeState} />, meState)}
              render={redirectIf(meState.loaded, meState.me, confLinks.profile, <SignIn requestMeUpdate={requestMeUpdate} meState={meState} setMeState={setMeState} />)}
            />
            <Route
              path={`${confLinks.profile}`}
              render={() => ( <div>profile</div> )}
              render={redirectIf(meState.loaded, !meState.me, '/sign-in', <Profile requestMeUpdate={requestMeUpdate} meState={meState} setMeState={setMeState} />)}
            />

            {/* ??? not works >> https://knowbody.github.io/react-router-docs/api/Route.html*/}
            {/* <Route path="/posts" asdasd={{}} components={{htmlBodyMaina: Posts, htmlBodySidebar: 'GroupsSidebar'}} /> */}
            
            {/* ??? */}
            {/* index.js:1437 Warning: React does not recognize the `computedMatch` prop on a DOM element. */}
            {/* <Container>
              <Row>
                <Col md={{ size: 8 }} className="p-3">
                  <Route path="/posts" render={Posts} />
                </Col>
                <Col md={{ size: 4 }} className="p-3">
                  authors
                </Col>
              </Row>
            </Container> */}
          </Switch>

          <Container className="mb-5" style={{borderBottom: '1px solid rgb(230, 230, 230, 1)'}}>
            <Row>
              <Col md={{ size: 8 }} className="p-3">
                <Route path="/posts" component={Posts} />
              </Col>
              <Col md={{ size: 4 }} className="p-3">
                <Route path="/posts" component={Authors} />
              </Col>
            </Row>
          </Container>

          <Container>
            <Row>
              <Col className="text-center py-5">footer goes hear</Col>
            </Row>
          </Container>
        </MeContext.Provider>
      </div>
  )
}

export default App
