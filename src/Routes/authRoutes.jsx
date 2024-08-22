import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/Loader/Loader";
const Login=lazy(()=>import("../pages/login/Login"))
const ForgotPassword=lazy(()=>import("../pages/login/ForgotPassword"))
const OtpVerification=lazy(()=>import("../pages/patient/OtpVerification"))
const Header=lazy(()=>import('../components/Guest/Header'))
const Footer=lazy(()=>import('../components/Guest/Footer'))
const Home=lazy(()=>import('../pages/patient/Home'))
const Error404=lazy(()=>import('../components/Error/Error'))
const NewPass = lazy(() => import('../pages/login/PasswordReset'));




function AuthRoutes() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
        <Route path='*' element={<Error404/>}/>
        <Route path="/" element={<><Header /> <Home /><Footer/></>} />
          <Route path="/login" element={<><Header/><Login /><Footer/></>} />
          <Route path="/forgotpassword/patient" element={<><Header/><ForgotPassword /><Footer/></>} />
          <Route path="/otp-verification" element={<><Header/><OtpVerification /><Footer/></>} />
          <Route path="/passwordReset" element={<><Header/><NewPass /><Footer/></>} />
        </Routes>
      </Suspense>
    </>
  );
}
export default AuthRoutes
