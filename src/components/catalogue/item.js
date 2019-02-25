import React, { Component } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background: green;
  color: white;
  font-weight: 400;
  border: 1px solid #085208;
  cursor: pointer;
  :hover {
    background: #588958;
  }
`

class Item extends Component {
  // componentDidMount() {
    // const { item } = this.props

    // this.intervalId = setInterval(() => {
    //   console.log(`I am ${item.title}`)
    // }, 2000)
  // }

  // componentWillUnmount() {
    // const { item } = this.props

    // clearInterval(this.intervalId)
    // console.log(`${item.title} is going away...`)
  // }

  render () {
    const { addToCart, item } = this.props

    return (
      <li className="col-md-4 mb-3">
        <h3>{item.title}</h3>
        <div>Price: ${item.price}</div>
        <br />

        {/* <StyledButton
          onClick={event => {
            event.preventDefault()
            addToCart(item)
          }}
        >
          Add to cart
        </StyledButton> */}

        <button className="btn btn-success"
          onClick={event => {
            event.preventDefault()
            addToCart(item)
          }}
        >
          Add to cart
        </button>
      </li>
    )
  }
}

export default Item
