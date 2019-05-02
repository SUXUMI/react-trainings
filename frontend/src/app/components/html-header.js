import React, {useContext} from 'react' //, { useState }
import { Container, Col, Row, NavLink } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap' //, NavDropdown, Nav
import MeContext from '../services/me-context'

const StyledLogoContainerDiv = styled.div`
    position: relative;
    text-align: left;

    @media only screen and (max-width: 768px) {
        color: orange !important;
        text-align: center;
        margin-bottom: 1rem;
    }
`

const StyledNavContainerDiv = styled.div`
    position: relative;
    text-align: right;

    @media only screen and (max-width: 768px) {
        color: orange !important;
        text-align: center;
    }
`

const HtmlHeader = ( props ) => {
    const { setMeState } = props
    // const [navOpen, setNavOpen] = useState(false)

    const { me } = useContext(MeContext)

    const logout = () => {
        localStorage.removeItem('token')
        //window.location.href = '/'
        setMeState({ me: false, loaded: true })
    }

    return (
        <Container className="header">
            <Row style={{borderBottom: '1px solid rgb(230, 230, 230, 1)', padding: '1rem 0'}}>
                <Col md="6" sm="12">
                    <StyledLogoContainerDiv>
                        <NavLink tag={Link} to="/">Home</NavLink>
                    </StyledLogoContainerDiv>
                </Col>
                <Col md="6" sm="12" className="text-right">
                    <StyledNavContainerDiv>
                        <Dropdown>
                            <Dropdown.Toggle variant="light">
                                <FontAwesomeIcon icon={faUserCircle} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {!me && (
                                    <React.Fragment>
                                        <NavLink tag={Link} to="/sign-in" className="dropdown-item">Sign in</NavLink>
                                        <NavLink tag={Link} to="/sign-up" className="dropdown-item" disabled>Sign up</NavLink>
                                    </React.Fragment>
                                )}
                                {me && (
                                    <div>
                                        <NavLink tag={Link} to="#" className="dropdown-item">Hi {`${me.firstName} ${me.lastName}`}</NavLink>
                                        <Dropdown.Divider />
                                        <NavLink tag={Link} to="/profile" className="dropdown-item">Profile</NavLink>
                                        {/* ??? reset postId in <Posts /> */}
                                        {/* <NavLink tag={Link} to="/posts/me" className="dropdown-item">My posts</NavLink> */}
                                        <NavLink tag={Link} to="/posts/me" className="dropdown-item" onClick={() => { window.location.href = '/posts/me' }}>My posts</NavLink>
                                        <Dropdown.Divider />
                                        <NavLink tag={Link} to="/" className="dropdown-item" onClick={logout}>Logout</NavLink>
                                    </div>
                                )}
                                
                                {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item> */}
                                
                            </Dropdown.Menu>
                        </Dropdown>
                    </StyledNavContainerDiv>
                </Col>
            </Row>
        </Container>
    )
}

export default HtmlHeader