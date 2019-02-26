import React, { Component } from 'react'
import styled from 'styled-components'

const StyledShoppingCartItemsContainer = styled.div`
  position: relative;
`

const StyledShoppingCartItems = styled.ul`
  display: block;
  position: absolute;
  z-index: 10;
  right: 0;
  :hover {}
`

const ShoppingCartItems = ({ items, removeFromCart }) => (
  <StyledShoppingCartItems>
    {items.map(i => (
      <li className="px-2 py-1 mb-2 bg-info text-white text-right text-nowrap" key={i.item.id}>
        <span>{i.item.title} ({i.quantity})</span>

        <button
          title="remove item"
          className="btn btn-warning btn-sm ml-3"
          onClick={event => {
            event.preventDefault();
            removeFromCart(i.item);
          }}
          >
          <i className="fas fa-minus" />
        </button>


        <button
          title="remove completly"
          className="btn btn-danger btn-sm ml-3"
          onClick={event => {
            event.preventDefault();
            removeFromCart(i.item, true);
          }}
          >
          <i className="fas fa-times" />
        </button>
      </li>
    ))}
  </StyledShoppingCartItems>
)

class ShoppingCart extends Component {
  state = {
    show: true
  }

  render() {
    const { items, count, removeFromCart } = this.props

    return (
      <StyledShoppingCartItemsContainer>
        Cart ({count})
        <br />
        <label>
          <input
            onChange={event => {
              this.setState({
                show: event.target.checked
              })
            }}
            type="checkbox"
            checked={this.state.show ? 'checked' : ''}
          /> show items
        </label>
        {this.state.show && (
          <ShoppingCartItems items={items} removeFromCart={removeFromCart}/>
        )}
      </StyledShoppingCartItemsContainer>
    )
  }
}

export default ShoppingCart
