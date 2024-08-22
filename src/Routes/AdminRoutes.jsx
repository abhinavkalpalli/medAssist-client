import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import SiderBar from '../pages/admin/AdminHome';
import Adminhead from '../components/Admin/Adminhead';

const AdminSignup=lazy(()=>import("../pages/login/Adminsignup"))
const Patients = lazy(() => import("../components/Admin/UsersList"));
const DoctorList = lazy(() => import("../components/Admin/DoctorsList"));
const Bookings = lazy(() => import("../components/Admin/BookingList"));
const NewPass = lazy(() => import('../pages/login/PasswordReset'));
const AdminLogin = lazy(() => import("../pages/login/AdminLogin"));
const Header = lazy(() => import('../components/Guest/Header'));
const Footer = lazy(() => import('../components/Guest/Footer'));
const AdminDashBoard = lazy(() => import('../components/Admin/AdminDash'));
const Error404=lazy(()=>import('../components/Error/Error'))
const Expertise=lazy(()=>import('../components/Admin/Expertise'))
function AdminRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<><Header/><AdminLogin /><Footer/></>} />
        <Route path="/signup" element={<><Header/><AdminSignup /><Footer/></>} />
        <Route 
          path="/*" 
          element={
            <div className="flex flex-col h-screen md:flex-row">
              <div className="w-full md:w-1/5 bg-background md:sticky top-0 shadow-md z-10">
                <SiderBar />
              </div>
              <div className="flex flex-col w-full md:w-4/5">
                <div className="sticky top-0 z-10 bg-background shadow-md">
                  <Adminhead />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <Routes>
                    <Route path='*' element={<Error404/>}/>
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/expertise" element={<Expertise />} />
                    <Route path="/doctors" element={<DoctorList />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/passwordreset" element={<NewPass />} />
                    <Route path="/dashboard" element={<AdminDashBoard />} />
                  </Routes>
                </div>
              </div>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default AdminRoutes;
