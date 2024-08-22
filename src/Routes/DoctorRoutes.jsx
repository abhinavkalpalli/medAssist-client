import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from '../components/Loader/Loader'
import Doctorlayout from '../pages/doctor/Doctorlayout'
const DoctorLogin=lazy(()=>import ('../pages/login/DoctorLogin'))
const DoctorSignup=lazy(()=>import('../pages/doctor/DoctorSignup'))
const Profile=lazy(()=>import('../components/Doctor/DoctorProfile'))
const NewPass=lazy(()=>import('../pages/login/PasswordReset'))
const BookingList=lazy(()=>import('../components/Doctor/DocBookings'))
const Slots=lazy(()=>import('../components/Doctor/SlotManage'))
const Video=lazy(()=>import('../components/Doctor/Videomodal'))
const Header=lazy(()=>import('../components/Guest/Header'))
const Footer=lazy(()=>import('../components/Guest/Footer'))
const WalletHistory=lazy(()=>import('../components/Doctor/WalletHistory'))
const Dashboard=lazy(()=>import('../components/Doctor/Dashboard/Dashboard'))
const Chat=lazy(()=>import('../components/Doctor/Communication/Chat'))
const Error404=lazy(()=>import('../components/Error/Error'))




function Doctorroute() {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route>
            <Route path='*' element={<Error404/>}/>
            <Route path="/login" element={<><Header/><DoctorLogin/><Footer/></>}/>
            <Route path="/signup" element={<><DoctorSignup/></>}/>
            <Route path="/profile" element={<Doctorlayout><Profile/></Doctorlayout>} />
            <Route path="/passwordreset" element={<Doctorlayout><NewPass/></Doctorlayout>}/>
            <Route path="/appointments" element={<Doctorlayout><BookingList/></Doctorlayout>}/>
            <Route path="/manageslot" element={<Doctorlayout><Slots/></Doctorlayout>}/>
            <Route path="/videoCall" element={<Doctorlayout><Video/></Doctorlayout>}/>
            <Route path="/walletHistory" element={<Doctorlayout><WalletHistory/></Doctorlayout>}/>
            <Route path="/dashboard" element={<Doctorlayout><Dashboard/></Doctorlayout>}/>
            <Route path="/chat" element={<Doctorlayout><Chat/></Doctorlayout>}/>
          </Route>
        </Routes>
      </Suspense>
    );
  }
  
  export default Doctorroute;
