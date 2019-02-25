import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  NavLink,
  Nav,
  Navbar,
  NavItem,
  NavbarBrand,
  Collapse,
  NavbarToggler,
} from 'reactstrap'
import ShoppingCart from './shopping-cart'

class Topbar extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState(state => ({
      isOpen: !state.isOpen
    }))
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Shopping Cart</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/catalogue">Catalogue</NavLink>
            </NavItem>
            <ShoppingCart
              items={this.props.cartItems}
              count={this.props.cartItemsQuantity}
              removeFromCart={this.props.removeFromCart}
            />
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default Topbar
