import React from 'react'
import Sidebar from '../../components/Patient/Profile/Sidebar'
import PatientProfile from '../../components/Patient/Profile/PatientProfile'

function Profile() {
  return (
    <div className="bg-gray-100">
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
        <Sidebar />
        <PatientProfile/>
      </div>
    </div>
  </div>
  )
}
export default Profile
