import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { cancelAppointment } from "../../services/patient/apiMethods";
import { drAppointments, fetchDoctor, patientHistory } from "../../services/doctor/apiMethods";
import PrescriptionModal from "./PrescriptionModel";
import { Link } from "react-router-dom";
import { updateDoctor } from "../../utils/reducers/doctorReducer";
import HistoryModal from "./HistoryModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const DEFAULT_SHIFTS = {
  "9am-10am": 9,
  "11am-12pm": 11,
  "2pm-3pm": 14,
  "5pm-6pm": 17,
  "8pm-9pm": 20,
};

const blueColor = '#2172d2';
const cyanColor = '#32c6d2';
const tealColor = '#17d5d1';

function DocBookings() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const doctorData = useSelector((state) => state.doctor.doctorData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [history, setHistory] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const fetchdoctor = async () => {
    const response = await fetchDoctor({ doctorId: doctorData._id });
    dispatch(updateDoctor({ doctorData: response.data.doctor }));
  };

  const fetchAppointments = async (date) => {
    const doctorId = doctorData._id;
    const dateto = date.toISOString().split("T")[0];
    const response = await drAppointments(dateto, doctorId);
    if (response.status === 200) {
      setAppointments(response.data.appointments);
    } else {
      toast.error(response.data.message);
      setAppointments([]);
    }
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Cancel this appointment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: blueColor,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      const response = await cancelAppointment(id);
      if (response.status === 200) {
        toast.success("Appointment canceled successfully");
        fetchdoctor();
        fetchAppointments(selectedDate);
      } else {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const handleHistoryClick = async (patientId) => {
    try {
      const response = await patientHistory({
        doctorId: doctorData._id,
        patientId,
      });
      if (response.status === 200) {
        setHistory(response.data.patientHistory);
        setIsHistoryModalOpen(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch patient history");
    }
  };

  const canCancel = (date, shift) => {
    const currentTime = new Date();
    const appointmentDate = new Date(date);
    const shiftHour = DEFAULT_SHIFTS[shift];
    if (shiftHour === undefined) return false;
    const shiftTime = new Date(appointmentDate);
    shiftTime.setHours(shiftHour, 0, 0, 0);
    if (appointmentDate.toDateString() === currentTime.toDateString()) {
      return shiftTime - currentTime > 60 * 60 * 1000;
    }
    return true;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center space-x-2">
          <p className="font-bold">Filter by date - </p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded px-3 py-2"
            dateFormat="yyyy-MM-dd"
            minDate={new Date(doctorData.createdAt)}
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Patient Name</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Email</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Booking Date</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Status</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Time</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>Actions</TableCell>
              <TableCell style={{ backgroundColor: blueColor, color: '#fff' }}>History of patient</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.patientId.name}</TableCell>
                  <TableCell>{appointment.patientId.email}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell style={{
                    backgroundColor: appointment.status === "Completed" ? tealColor :
                      appointment.status === "Cancelled" ? '#f56565' :
                        appointment.status === "Active" ? cyanColor : 'transparent',
                    color: '#fff'
                  }}>
                    {appointment.status}
                  </TableCell>
                  <TableCell>{appointment.shift}</TableCell>
                  <TableCell>
                    {appointment.status === "Cancelled" ? (
                      <Button variant="contained" color="info" disabled>
                        Cancelled
                      </Button>
                    ) : appointment.status === "Completed" ? (
                      <Button variant="contained" color="primary" onClick={() => handleOpenModal(appointment)}>
                        Prescribe
                      </Button>
                    ) : (
                      <>
                        <Button variant="contained" color="primary" style={{ marginRight: 8 }}>
                          <Link to="/doctor/chat" state={{ data: appointment }} style={{ color: 'white', textDecoration: 'none' }}>
                            Intake
                          </Link>
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCancel(appointment._id)}
                          disabled={!canCancel(appointment.date, appointment.shift)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" onClick={() => handleHistoryClick(appointment.patientId._id)}>
                      View History
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedAppointment && (
        <PrescriptionModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          appointment={selectedAppointment}
          doctor={doctorData}
        />
      )}
      {isHistoryModalOpen && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onRequestClose={() => setIsHistoryModalOpen(false)}
          history={history}
        />
      )}
    </div>
  );
}

export default DocBookings;
