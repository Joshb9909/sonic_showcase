import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'

function App(){

  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  
  const whoAmI = async () => {
	  let response = await api.get('/user/info/')
	  if(response.data){
		  setUser(response.data)
		  navigate('/home')
	  } else {
		  setUser(null)
		  navigate('/')

	  }
  }

  useEffect(() => {
	  whoAmI()
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Outlet />
    </AppContext.Provider >
  )
  }

export default App
