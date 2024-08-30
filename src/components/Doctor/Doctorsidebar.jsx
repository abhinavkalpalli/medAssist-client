import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profilePlaceholder from "../../assets/doctor.jpg";
import { removeDoctor } from "../../utils/reducers/doctorReducer";
import DocumentModal from "./DocumentModal";

function Doctorsidebar() {
  const navigate = useNavigate();
  const doctorData = useSelector((state) => state.doctor.doctorData);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState(doctorData.documents || []);

  const logout = () => {
    try {
      dispatch(removeDoctor());
      navigate("/doctor/login", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-blue-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
      : "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out";
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddDocument = (newDocument) => {
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
  };

  const handleDeleteDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  return (
    <div className="col-span-4 sm:col-span-3 bg-gray-300">
      <div className="bg-gray-300 p-4 sm:p-10">
        <div className="flex flex-col items-center">
          <img
            className="h-[110px] w-[120px] rounded-full mt-1"
            src={doctorData?.photo || profilePlaceholder}
            alt="Profile"
          />
          <button className="h-6 w-32 rounded bg-blue-500 text-white font-semibold mt-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out">
            <Link to="/doctor/profile">VIEW PROFILE</Link>
          </button>
          <h1 className="text-xl font-bold text-center mt-2 sm:mt-4">
            Dr. {doctorData.name}
          </h1>
          <p className="text-gray-700 font-bold text-center">
            {doctorData.expertise?.name}
          </p>
          <p className="text-gray-700 font-bold text-center">
            Wallet: ₹{doctorData.Wallet}
          </p>
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex flex-col mt-8">
          <ul>
            <li className="mb-2">
              <div className={getLinkClass("/doctor/dashboard")}>
                <Link to="/doctor/dashboard" className="block">
                  DASHBOARD
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className={getLinkClass("/doctor/appointments")}>
                <Link to="/doctor/appointments" className="block">
                  APPOINTMENTS
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className={getLinkClass("/doctor/manageslot")}>
                <Link to="/doctor/manageslot" className="block">
                  SLOT UPDATE
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className={getLinkClass("/doctor/passwordreset")}>
                <Link to="/doctor/passwordreset" className="block">
                  EDIT PASSWORD
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className={getLinkClass("#")}>
                <Link to="#" className="block" onClick={openModal}>
                  UPLOAD DOCUMENTS
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className={getLinkClass("/doctor/walletHistory")}>
                <Link to="/doctor/walletHistory" className="block">
                  WALLETHISTORY
                </Link>
              </div>
            </li>
            <li className="mb-2">
              <div className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out">
                <button onClick={logout}>LOGOUT</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <DocumentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        documents={documents}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        onVerify={() => {}}
      />
    </div>
  );
}

export default Doctorsidebar;
