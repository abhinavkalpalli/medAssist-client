
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'


function DoctorPrivateRoutes() {
    const isAuthenticated=useSelector((state)=>state.doctor.validUser)
if(isAuthenticated){
  return (
    <>
    <Outlet/>
    </>    
  )
}
return <Navigate to='/doctor/login'/>
}

export default DoctorPrivateRoutes
