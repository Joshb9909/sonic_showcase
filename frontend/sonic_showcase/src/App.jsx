import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext'

function App(){

  const [user, setUser] = useState(null)

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Outlet />
    </AppContext.Provider >
  )
  }

export default App
