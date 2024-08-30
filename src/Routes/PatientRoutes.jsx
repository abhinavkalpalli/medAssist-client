import { Routes, Route} from "react-router-dom";
import { lazy, Suspense } from "react";
import VideoCallPatient from '../components/Patient/Videomodal'
import Loader from "../components/Loader/Loader";
import PrivateRoutes from "./PrivateRoutes";
const PasswordReset=lazy(()=>import("../pages/login/PasswordReset"))
const Doctor=lazy(()=>import('../components/Patient/Doctorlist'))
const Header=lazy(()=>import("../components/Home/Heder"))
const Footer=lazy(()=>import("../components/Home/Footer"))
const Profile=lazy(()=>import("../pages/patient/Profile"))
const Payment=lazy(()=>import("../components/payment/Payment"))
const Appointments=lazy(()=>import("../components/Patient/Appointments"))
const PatientSignup=lazy(()=>import("../pages/patient/PatientSignup"))
const Patientlayout=lazy(()=>import("../pages/patient/Patientlayout"))
const WalletHistory=lazy(()=>import('../components/Doctor/WalletHistory'))
const Chat=lazy(()=>import('../components/Patient/Communication/Chat'))
const Error404=lazy(()=>import('../components/Error/Error'))
const GuestHeader=lazy(()=>import('../components/Guest/Header'))
const GuestFooter=lazy(()=>import('../components/Guest/Footer'))
const AboutUs=lazy(()=>import('../pages/patient/AboutUs'))






function PatientRoute() { 
    return (
      <>
  <Suspense fallback={<Loader/>}>
    <Routes>
      <Route >    
      <Route path='*' element={<Error404/>}/>
        <Route path="/signup" element={<><GuestHeader/><PatientSignup/><GuestFooter/></>} />
        <Route element={<PrivateRoutes/>}>
        <Route path="/doctorlist" element={<><Header /><Patientlayout><Doctor/></Patientlayout><Footer/></>}/>
        <Route path="/aboutUs" element={<><Header /><Patientlayout><AboutUs/></Patientlayout><Footer/></>}/>
        <Route path="/favouritedoctorlist" element={<><Header /><Patientlayout><Doctor/></Patientlayout><Footer/></>}/>
        <Route path="/profile" element={<><Header /><Profile/><Footer/></>}/>
        <Route path="/passwordreset" element={<><Header /><Patientlayout><PasswordReset/></Patientlayout><Footer/></>}/>
        <Route path="/appointments" element={<><Header /><Patientlayout><Appointments/></Patientlayout><Footer/></>}/>
        <Route path="/payment" element={<><Header /><Patientlayout><Payment/></Patientlayout><Footer/></>}/>
        <Route path="/redirectToCall" element={<><Header /><Patientlayout><VideoCallPatient /></Patientlayout><Footer/></>} />
        <Route path="/walletHistory" element={<><Header /><Patientlayout><WalletHistory /></Patientlayout><Footer/></>} />
        <Route path="/chat" element={<><Header /><Patientlayout><Chat /></Patientlayout><Footer/></>} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
      </>
    );
  }
  export default PatientRoute;