import React from 'react';
import { useSelector } from 'react-redux';
import Doctorsidebar from '../../components/Doctor/Doctorsidebar';
import Doctorhead from '../../components/Doctor/Doctorhead';


const Doctorlayout = ({ children }) => {
  const Doctor = useSelector((state) => state.doctor.doctorData);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Doctorhead />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="lg:hidden bg-gray-300">
          <Doctorsidebar />
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-300">
          <Doctorsidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md">
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Doctorlayout;
