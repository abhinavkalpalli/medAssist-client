import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { fetchAllAppointments,drAppointments} from '../../../services/doctor/apiMethods';
import { Chart } from 'react-google-charts';
import toast from "react-hot-toast";

function Dashboard() {
  const Doctor = useSelector((state) => state.doctor.doctorData);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState({});
  const date=new Date()
  


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetchAllAppointments(Doctor?._id);
        if (response.status === 200) {
          const appointmentsData = response.data.appointments;
          setAppointments(appointmentsData);
          const uniquePatients = getUniquePatients(appointmentsData);
          setPatients(uniquePatients);
          calculateTotalIncome(appointmentsData);
          calculateMonthlyIncome(appointmentsData);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (Doctor?._id) {
      fetchAppointments();
    }
  }, [Doctor?._id]);
  useEffect(()=>{
    fetchAppointmentS()
  },[])
  const fetchAppointmentS=async()=>{
    const dateto = date.toISOString().split("T")[0];
    const response=await drAppointments(dateto,Doctor._id)
    if(response.status===200){
     const todayappointment= response.data.appointments.filter((item) => {
        return item.status==='Active'; 
      })
      if (todayappointment.length > 0) {
        todayappointment.forEach((appointment) => {
          toast.success(`Gentle reminder that you have an appointment today at ${appointment.shift}`);
        });
      }
      
    }
  }


  const getUniquePatients = (bookings) => {
    const patientsMap = {};
    bookings.forEach((booking) => {
      if (!patientsMap[booking.patientId.email]) {
        patientsMap[booking.patientId.email] = booking.patientId;
      }
    });
    return Object.values(patientsMap);
  };

  const calculateTotalIncome = (bookings) => {
    const totalIncomeAmount = bookings.reduce((total, booking) => {
      if (booking.status === 'Completed') {
        return total + booking.Fee;
      }
      return total;
    }, 0);
    setTotalIncome(totalIncomeAmount);
  };

  const calculateMonthlyIncome = (bookings) => {
    const monthlyIncomeMap = {};

    bookings.forEach((booking) => {
      if (booking.status === 'Completed') {
        const bookingDate = new Date(booking.date);
        const monthYear = `${bookingDate.getMonth() + 1}-${bookingDate.getFullYear()}`;

        if (!monthlyIncomeMap[monthYear]) {
          monthlyIncomeMap[monthYear] = 0;
        }

        monthlyIncomeMap[monthYear] += booking.Fee;
      }
    });

    setMonthlyIncome(monthlyIncomeMap);
  };

  const completedBookingsCount = appointments.filter(appointment => appointment.status === 'Completed').length;
  const cancelledBookingsCount = appointments.filter(appointment => appointment.status === 'Cancelled').length;
  const pendingBookingsCount = appointments.filter(appointment => appointment.status === 'Active').length;

  const sortedAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const updatedData = [
    ['Booking Type', 'Count'],
    ['Completed', completedBookingsCount],
    ['Cancelled', cancelledBookingsCount],
    ['Pending', pendingBookingsCount]
  ];

  const options = {
    title: 'Booking Statistics',
    pieHole: 0.4,
    colors: ['#4CAF50', '#F44336', '#2196F3'],
    pieSliceText: 'label',
    legend: { position: 'top', textStyle: { color: 'white' } },
    backgroundColor: 'black',
    chartArea: {
      width: '80%',
      height: '80%',
      backgroundColor: 'black',
    },
    titleTextStyle: {
      color: 'white',
    },
  };

  return (
    <div className="container mx-auto py-6 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg">
          <LineChart appointments={appointments} />
        </div>
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg">
          <BarChart appointments={appointments} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg">
          <h2 className="text-lg font-semibold text-white">Consulted Patients</h2>
          <ul className="text-white overflow-y-auto" style={{ maxHeight: '200px' }}>
            {patients.map((patient) => (
              <div className="flex mt-2" key={patient._id}>
                <img
                  src={patient.photo || '../../../assets/user.png'}
                  alt={`${patient.name}'s profile`}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <li className="border-b border-gray-700 py-1">
                  {patient.name}
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg">
          <h2 className="text-lg font-semibold text-white">Latest Appointments</h2>
          <ul className="text-white overflow-y-auto" style={{ maxHeight: '200px' }}>
            {sortedAppointments.map((appointment) => (
              <li key={appointment._id} className="border-b border-gray-700 py-1 text-sm">
                {new Date(appointment.date).toLocaleDateString()} with {appointment.patientId.name} on {appointment.shift}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-white">Total Income</h2>
          <div className="text-white text-2xl mt-4">{totalIncome} INR</div>
          <br />
          <h2 className="text-lg font-semibold text-white">Monthly Income</h2>
          <div className="text-white text-2xl mt-4">
            {Object.entries(monthlyIncome).map(([monthYear, amount]) => (
              <div key={monthYear}>
                {monthYear}: {amount} INR
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-white mb-4">Booking Statistics</h2>
          <Chart
            chartType="PieChart"
            data={updatedData}
            options={options}
            width={"100%"}
            height={"200px"}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
