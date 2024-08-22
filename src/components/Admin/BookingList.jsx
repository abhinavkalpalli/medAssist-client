import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { bookingList } from '../../services/admin/apiMethods';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress } from '@mui/material';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

Modal.setAppElement('#root');

const blueColor = '#2172d2';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filterDate]);

  const fetchBookings = async () => {
    setLoading(true);
    const inputDate = new Date(filterDate);
    inputDate.setUTCHours(0, 0, 0, 0);
    const isoDateString = inputDate.toISOString().split("T")[0]; 
    const data = {
      page: currentPage,
      date: isoDateString,
    };
    const response = await bookingList(data);
    if (response.data) {
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      date.setUTCHours(0, 0, 0, 0);
      setFilterDate(date);
    }
  };

  const viewBooking = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-blue-500'; 
      case 'Completed':
        return 'text-green-500'; 
      case 'Cancelled':
        return 'text-red-500'; 
      default:
        return ''; 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="m-4">
      <Typography variant="h4" component="h1" style={{ color: blueColor, textAlign: 'center' }} gutterBottom>
        Booking List
      </Typography>
      <div className="flex items-center justify-between mb-4">
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="bookings table">
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: '#fff' }}>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} hover onClick={() => viewBooking(booking._id)} style={{ cursor: 'pointer' }}>
                <TableCell>{booking.doctorId.name}</TableCell>
                <TableCell>{booking.patientId.name}</TableCell>
                <TableCell>{booking.patientId.email}</TableCell>
                <TableCell className={getStatusColor(booking.status)}>{booking.status}</TableCell>
                <TableCell>{booking.shift}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          style={{ backgroundColor: blueColor, color: '#fff' }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </Button>
        {[...Array(Math.min(3, totalPages)).keys()].map((index) => (
          <Button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            variant="contained"
            color={currentPage === index + 1 ? 'primary' : 'default'}
            style={{ backgroundColor: currentPage === index + 1 ? blueColor : '#e0e0e0', color: currentPage === index + 1 ? '#fff' : '#000' }}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          variant="contained"
          color="primary"
          disabled={currentPage === totalPages}
          style={{ backgroundColor: blueColor, color: '#fff' }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </Button>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Booking Details"
          className="modal"
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Booking Details
          </Typography>
          {selectedBooking && (
            <div>
              <p><strong>Doctor:</strong> {selectedBooking.doctorId.name}</p>
              <p><strong>Patient:</strong> {selectedBooking.patientId.name}</p>
              <p><strong>Patient Email:</strong> {selectedBooking.patientId.email}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Shift:</strong> {selectedBooking.shift}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
            </div>
          )}
          <Button onClick={closeModal} variant="contained" color="primary" style={{ backgroundColor: blueColor, color: '#fff' }}>
            Close
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default BookingList;
