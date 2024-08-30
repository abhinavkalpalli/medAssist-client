import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'
function AdminPrivateRoutes() {
    const isAuthenticated=useSelector((state)=>state.admin.validUser)
    if(isAuthenticated){
  return (
    <div>
      <Outlet/>
    </div>
  )
}
return <Navigate to='/admin/login'/>
}

export default AdminPrivateRoutes
