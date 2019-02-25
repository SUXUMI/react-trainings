import React, { Component } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  padding: 3px;
  margin: 5px;
`

const CatalogueSearch = ({ value, onChange }) => (
  <StyledInput
    value={value}
    onChange={onChange}
    placeholder='Type for search'
  />
)

export default CatalogueSearch
