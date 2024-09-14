import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { bookingList } from "../../services/admin/apiMethods";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

const blueColor = "#2172d2";

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
    } else {
      toast.error("Something Went Wrong");
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
      case "Active":
        return "blue";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "black";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ margin: "16px" }}>
      <h1 style={{ color: blueColor, textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        BOOKINGS
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="mt-1 block rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="bookings table">
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor }}>
              <TableCell style={{ color: "#fff" }}>Doctor Name</TableCell>
              <TableCell style={{ color: "#fff" }}>Patient Name</TableCell>
              <TableCell style={{ color: "#fff" }}>Patient Email</TableCell>
              <TableCell style={{ color: "#fff" }}>Status</TableCell>
              <TableCell style={{ color: "#fff" }}>Shift</TableCell>
              <TableCell style={{ color: "#fff" }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  hover
                  onClick={() => viewBooking(booking._id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{booking.doctorId.name}</TableCell>
                  <TableCell>{booking.patientId.name}</TableCell>
                  <TableCell>{booking.patientId.email}</TableCell>
                  <TableCell style={{ color: getStatusColor(booking.status) }}>
                    {booking.status}
                  </TableCell>
                  <TableCell>{booking.shift}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
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
      <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          variant="contained"
          disabled={currentPage === 1}
          style={{ backgroundColor: blueColor, color: "#fff", margin: "0 4px" }}
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </Button>
        {[...Array(Math.min(3, totalPages)).keys()].map((index) => (
          <Button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            variant="contained"
            style={{
              backgroundColor: currentPage === index + 1 ? blueColor : "#e0e0e0",
              color: currentPage === index + 1 ? "#fff" : "#000",
              margin: "0 4px",
            }}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          variant="contained"
          disabled={currentPage === totalPages}
          style={{ backgroundColor: blueColor, color: "#fff", margin: "0 4px" }}
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
          <Button
            onClick={closeModal}
            variant="contained"
            style={{ backgroundColor: blueColor, color: "#fff" }}
          >
            Close
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default BookingList;
