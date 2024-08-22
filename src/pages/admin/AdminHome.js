import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profilePlaceholder from "../../assets/admin.png";
import { removeAdmin } from "../../utils/reducers/adminReducer";
import SetFeeModal from "./setFeeModal"; // Adjust the path according to your directory structure

function AdminHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const adminData = useSelector((state) => state.admin.adminData);
  const [baseFee, setBaseFee] = useState(adminData.baseFee);
  const [increment, setIncrement] = useState(adminData.Increment);

  const logout = () => {
    try {
      dispatch(removeAdmin());
      navigate('/login', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "bg-blue-700 text-white py-2 px-4 rounded border border-black text-sm sm:text-base md:text-lg" 
      : "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded border border-black text-sm sm:text-base md:text-lg";
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="flex flex-col items-center mb-6">
        <img
          className="h-24 w-24 rounded-full bg-white"
          src={profilePlaceholder}
          alt="Profile"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2">ADMIN</h1>
      </div>
      <hr className="my-6 border-t border-gray-300" />
      <div className="flex flex-col space-y-4">
        <ul>
          <li>
            <div className={getLinkClass("/admin/dashboard")}>
              <Link to="/admin/dashboard" className="block text-center py-2 px-4">
                DASHBOARD
              </Link>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/patients")}>
              <Link to="/admin/patients" className="block text-center py-2 px-4">
                PATIENTS
              </Link>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/doctors")}>
              <Link to="/admin/doctors" className="block text-center py-2 px-4">
                DOCTORS
              </Link>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/bookings")}>
              <Link to="/admin/bookings" className="block text-center py-2 px-4">
                BOOKINGS
              </Link>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/expertise")}>
              <Link to="/admin/expertise" className="block text-center py-2 px-4">
                EXPERTISE
              </Link>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/setfee")} onClick={() => setIsModalOpen(true)}>
              <div className="block text-center py-2 px-4 cursor-pointer">
                SET FEE 
              </div>
            </div>
          </li>
          <li>
            <div className={getLinkClass("/admin/passwordreset")}>
              <Link to="/admin/passwordreset" className="block text-center py-2 px-4">
                CHANGE PASSWORD
              </Link>
            </div>
          </li>
          <li>
            <div className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded border border-black text-sm sm:text-base md:text-lg text-center">
              <button onClick={logout} className="w-full">LOG-OUT</button>
            </div>
          </li>
        </ul>
      </div>
      <SetFeeModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        baseFee={baseFee}
        setBaseFee={setBaseFee}
        increment={increment}
        setIncrement={setIncrement}
      />
    </div>
  );
}

export default AdminHome;
