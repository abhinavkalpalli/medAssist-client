import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Patient/Profile/Sidebar';

const Patientlayout = ({ children }) => {
  const user = useSelector((state) => state.user.userData);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="lg:col-span-9 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patientlayout;
