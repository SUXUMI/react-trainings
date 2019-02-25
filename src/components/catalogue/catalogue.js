import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import Search from './search'
import CatalogueList from './list'

const Secret = () => (
  <div>
    I'm very secret!!!
  </div>
)

class Catalogue extends Component {
  state = {
    term: ''
  }

  onTermChange = e => {
    this.setState({
      term: e.target.value,
    })
  }

  // componentDidMount() {
    // getData().then(result => {
    //   this.setState({ items: result.items })
    // })
    // console.log('Catalogue have mounted')
  // }

  // shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextProps)
    // console.log(nextState)

    // return true
  // }
  
  render() {
    const { addToCart, items } = this.props

    return (
      <Fragment>
        <h2>Product Catalogue</h2>
        
        <Route path="/secret" component={Secret} />
        <Search
          value={this.state.term}
          onChange={this.onTermChange}
        />
        <CatalogueList
          items={items}
          addToCart={addToCart}
          term={this.state.term}
        />
      </Fragment>
    )
  }
}

export default Catalogue
