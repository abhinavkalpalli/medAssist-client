import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
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
  Box,
} from "@mui/material";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  cancelAppointment,
  fetchPatient,
  yourBooking,
} from "../../services/patient/apiMethods";
import swal from "sweetalert";
import jsPDF from "jspdf";
import { updateReduxUser } from "../../utils/reducers/userReducer";
import profileholder from "../../assets/Med Assist.png";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import StarRatingModal from "./StarRatingModal";
import Nodata from "../ui/Nodata";
import toast from "react-hot-toast";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "50%", // Matches the w-1/2 class
  maxHeight: "80%", // Adds some max height for responsiveness
  overflowY: "auto", // Scroll if content overflows
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2172d2",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const logoUrl = profileholder;
const blueColor = "#2172d2";
const cyanColor = "#32c6d2";
const tealColor = "#17d5d1";
const yellowColor = "#FFFF00";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const appointmentsPerPage = 8;
  const User = useSelector((state) => state.user.userData);
  const patientId = User._id;

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      const response = await yourBooking(patientId);
      setAppointments(response.data.data);
    } catch (error) {
      setError(error.message);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const FetchPatient = async () => {
    const userResponse = await fetchPatient({ patientId });
    dispatch(updateReduxUser({ userData: userResponse.data.patient }));
  };

  const handleAppointmentCancellation = async (id) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "Do you really want to cancel this appointment?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (confirmed) {
        const response = await cancelAppointment(id);
        if (response.status === 200) {
          fetchAppointments();
          FetchPatient();
          swal("Cancelled!", "The appointment has been cancelled.", "success");
        } else {
          swal(
            "Failed!",
            "There was a problem cancelling the appointment.",
            "error"
          );
        }
      } else {
        swal("Cancelled", "The appointment is still booked.", "info");
      }
    } catch (error) {
      swal("Error!", "An unexpected error occurred.", "error");
    }
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleReviewModelOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalOpen(true);
  };

  const handleReviewModelClose = () => {
    setReviewModalOpen(false);
    setSelectedAppointment(null);
  };
  const getLastVisit = (doctorId) => {
    const completedAppointments = appointments.filter(
      (appointment) =>
        appointment.status === "Completed" &&
        appointment.doctorId._id === doctorId
    );
    if (completedAppointments.length === 0)
      return { date: "N/A", shift: "N/A" };

    completedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestAppointment = completedAppointments[0];
    return {
      date: formatDate(latestAppointment.date),
      shift: latestAppointment.shift,
    };
  };

  const downloadPrescription = () => {
    if (selectedAppointment?.Prescription?.length) {
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.width;
      const logoWidth = 80;
      const logoHeight = 40;
      const centerX = (pageWidth - logoWidth) / 2;
      const centerY = 10;

      doc.addImage(logoUrl, "PNG", centerX, centerY, logoWidth, logoHeight);

      const titleY = centerY + logoHeight + 10;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Prescription Details", pageWidth / 2, titleY, {
        align: "center",
      });

      const underlineY = titleY + 5;
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.line(10, underlineY, pageWidth - 10, underlineY);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const patientDetails = `
        Patient: ${User.name}
      `;
      const patientDetailsY = underlineY + 10;
      doc.text(patientDetails, 10, patientDetailsY, {
        maxWidth: pageWidth - 20,
      });

      const paragraph = `
        This prescription is issued by Dr. ${
          selectedAppointment.doctorId.name
        }, who specializes in ${
        selectedAppointment.doctorId.expertise.name
      } at ${
        selectedAppointment.doctorId.currentWorkingHospital
      }. The consultation took place on ${formatDate(
        selectedAppointment.date
      )} during the ${selectedAppointment.shift} shift.
      `;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const paragraphLines = doc.splitTextToSize(paragraph, pageWidth - 20);
      const paragraphHeight = paragraphLines.length * 8;
      doc.text(paragraphLines, 10, patientDetailsY + 10, {
        maxWidth: pageWidth - 20,
      });

      const underlineY2 = patientDetailsY + 10 + paragraphHeight;
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.line(10, underlineY2, pageWidth - 10, underlineY2);

      // Table Header
      const tableStartY = underlineY2 + 10;
      doc.setFont("helvetica", "bold");
      doc.text("Medicine", 10, tableStartY);
      doc.text("Time", 80, tableStartY);
      doc.text("Count", 140, tableStartY);

      // Table Content
      doc.setFont("helvetica", "normal");
      selectedAppointment.Prescription.forEach((item, index) => {
        const [medicine, time, count] = item.split(" - ");
        doc.text(medicine, 10, tableStartY + (index + 1) * 10);
        doc.text(time, 80, tableStartY + (index + 1) * 10);
        doc.text(count, 140, tableStartY + (index + 1) * 10);
      });

      doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.height - 10);

      doc.save("prescription-details.pdf");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <Button
        key={number}
        onClick={() => handlePageChange(number)}
        variant={currentPage === number ? "contained" : "outlined"}
        className="mx-1"
        style={{
          backgroundColor: currentPage === number ? blueColor : "transparent",
          color: currentPage === number ? "#fff" : blueColor,
        }}
      >
        {number}
      </Button>
    ));
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <>
      <div className="bg-gray-100">
        {appointments.length < 1 ? (
          <Nodata />
        ) : (
          <>
            {" "}
            <div className="container mx-auto py-8">
              <div className="bg-white p-4 shadow rounded-lg">
                <h1
                  className={`text-4xl font-extrabold mb-6 text-center text-gray-800`}
                >
                  Your Appointments
                </h1>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Doctor Name</StyledTableCell>
                        <StyledTableCell>Expertise</StyledTableCell>
                        <StyledTableCell>Booking Date</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Time</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                        <StyledTableCell>Last Visit</StyledTableCell>
                        <StyledTableCell>Review</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentAppointments.map((appointment) => {
                        const lastVisit = getLastVisit(
                          appointment.doctorId._id
                        );

                        return (
                          <StyledTableRow key={appointment._id}>
                            <StyledTableCell>{`DR ${appointment.doctorId.name}`}</StyledTableCell>
                            <StyledTableCell>
                              {appointment.doctorId.expertise.name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {formatDate(appointment.date)}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                backgroundColor:
                                  appointment.status === "Active"
                                    ? cyanColor
                                    : appointment.status === "Cancelled"
                                    ? "#f56565"
                                    : appointment.status === "Completed"
                                    ? tealColor
                                    : "",
                                color: "#fff",
                              }}
                            >
                              {appointment.status === "Active"
                                ? "Upcoming"
                                : appointment.status === "Cancelled"
                                ? "Cancelled"
                                : appointment.status === "Completed"
                                ? "Completed"
                                : appointment.status}
                            </StyledTableCell>
                            <StyledTableCell>
                              {appointment.shift}
                            </StyledTableCell>
                            <StyledTableCell>
                              {appointment.status === "Active" && (
                                <Button
                                  onClick={() =>
                                    handleAppointmentCancellation(
                                      appointment._id
                                    )
                                  }
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    backgroundColor: blueColor,
                                    color: "#fff",
                                  }}
                                  className="mx-1"
                                >
                                  Cancel
                                </Button>
                              )}
                              {appointment.status === "Completed" && (
                                <Button
                                  onClick={() => handleOpenModal(appointment)}
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    backgroundColor: blueColor,
                                    color: "#fff",
                                  }}
                                  className="mx-1"
                                >
                                  Prescription
                                </Button>
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>
                                <strong>Last Visit Date:</strong>{" "}
                                {lastVisit.date}
                              </p>
                              <p>
                                <strong>Shift:</strong> {lastVisit.shift}
                              </p>
                            </StyledTableCell>
                            {appointment.status === "Completed" && (
                              <StyledTableCell>
                                <Button
                                  onClick={() =>
                                    handleReviewModelOpen(appointment)
                                  }
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    backgroundColor: yellowColor,
                                    color: "#fff",
                                  }}
                                  className="mx-1"
                                >
                                  Review
                                </Button>
                              </StyledTableCell>
                            )}
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handlePreviousPage}
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: blueColor, color: "#fff" }}
                    disabled={currentPage === 1}
                    className="mx-2"
                  >
                    <MdOutlineKeyboardDoubleArrowLeft />
                  </Button>
                  {renderPageNumbers()}
                  <Button
                    onClick={handleNextPage}
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: blueColor, color: "#fff" }}
                    disabled={currentPage === totalPages}
                    className="mx-2"
                  >
                    <MdOutlineKeyboardDoubleArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal open={reviewModalOpen} onClose={handleReviewModelClose}>
        <StarRatingModal
          appointment={selectedAppointment}
          onClose={handleReviewModelClose}
        />
      </Modal>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="prescription-modal-title"
        aria-describedby="prescription-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="prescription-modal-title"
            variant="h6"
            component="h2"
            className="text-xl font-semibold mb-4"
          >
            Prescription Details
          </Typography>
          {selectedAppointment && (
            <>
              <img
                src={logoUrl}
                alt="MedAssist Logo"
                className="w-24 mb-4 mx-auto"
              />
              <Typography variant="body1" component="p">
                <strong>Doctor:</strong> {selectedAppointment.doctorId.name}
              </Typography>
              <Typography variant="body1" component="p">
                <strong>Specialization:</strong>{" "}
                {selectedAppointment.doctorId.expertise.name}
              </Typography>
              <Typography variant="body1" component="p">
                <strong>Hospital:</strong>{" "}
                {selectedAppointment.doctorId.currentWorkingHospital}
              </Typography>
              <Typography variant="body1" component="p">
                <strong>Date:</strong> {formatDate(selectedAppointment.date)}
              </Typography>
              <Typography variant="body1" component="p">
                <strong>Shift:</strong> {selectedAppointment.shift}
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                className="text-lg font-semibold mt-4"
              >
                Medicines:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedAppointment.Prescription &&
                    selectedAppointment.Prescription.length > 0 ? (
                      selectedAppointment.Prescription.map((item, index) => {
                        const [medicine, time, count] = item.split(" - ");
                        return (
                          <TableRow key={index}>
                            <TableCell>{medicine}</TableCell>
                            <TableCell>{time}</TableCell>
                            <TableCell>{count}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          No prescriptions available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                onClick={downloadPrescription}
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: blueColor,
                  color: "#fff",
                  mt: 4,
                  display: "block",
                  margin: "0 auto",
                }}
              >
                Download Prescription
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Appointments;
