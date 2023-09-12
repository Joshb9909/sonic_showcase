import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { api } from './utilities'

function App(){

  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    whoAmI();
  }, []);
  
  const whoAmI = async () => {
    try {
      const response = await api.get('/user/info/');
      if(response.data){
        setUser(response.data)
      } else {
        setUser(null)
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setUserLoading(false)
    }
  }

  return (
    <AppContext.Provider value={{ user, setUser, userLoading }}>
      <Outlet />
    </AppContext.Provider >
  )
  }

export default App
