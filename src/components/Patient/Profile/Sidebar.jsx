import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profilePlaceholder from '../../../assets/user.png'
import { removeUser } from "../../../utils/reducers/userReducer";


function Sidebar() {
   const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate=useNavigate()
   const location = useLocation();
  const logout = () => {
    try {
      dispatch(removeUser());
      navigate('/login', { replace: true });
    
    } catch (err) {
      console.log(err);
    }
  };

   const getLinkClass = (path) => {
     return location.pathname === path
       ? "block bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out text-center"
       : "block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out text-center";
  };

  return (
    <div className="col-span-4 sm:col-span-3">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">
            Med <span className="text-red-500">Assist</span>
          </h1>
          <img
            className="h-24 w-24 rounded-full mt-4 border-2 border-gray-300"
            src={user?.photo || profilePlaceholder}
            alt="Profile"
          />
          <h1 className="text-xl font-semibold mt-4">{user.name}</h1>
          <p className="text-gray-700">{user.email}</p>
          <hr />
          <p> Wallet: ₹{user.Wallet}</p>
        </div>
        <hr className="my-6 border-t border-gray-300" />
        <div className="flex flex-col">
          <ul>
            <li className="mb-3">
              { <Link to="/patient/profile" className={getLinkClass("/patient/profile")}>
                PROFILE
              </Link> }
            </li>
            <li className="mb-3">
              {<Link
                to={{
                  pathname: "/patient/favouritedoctorlist",
                  search: "?favorite=true"
                }}
                className={getLinkClass("/patient/favouritedoctorlist")}
              >
                FAVORITE DOCTORS
              </Link> }
            </li>
            <li className="mb-3">
              <Link
                to="/patient/doctorlist"
                className={getLinkClass("/patient/doctorlist")}
              >
                BOOKING
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/patient/appointments"
                className={getLinkClass("/patient/appointments")}
              >
                APPOINTMENTS
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/patient/passwordreset" className={getLinkClass("/patient/passwordreset")}>
                CHANGE PASSWORD
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/patient/walletHistory" className={getLinkClass("/patient/walletHistory")}>
                WALLET HISTORY
              </Link>
            </li>
            <li className="mb-3">
              <button
              onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                LOGOUT
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
