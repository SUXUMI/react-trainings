import React from 'react'

const MeContext = React.createContext({
  me: null,
  loaded: false,
})

export default MeContext
