import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";

import "@fortawesome/fontawesome-free/css/all.min.css";

import { postPrescription } from "../../services/doctor/apiMethods";

const PrescriptionModal = ({ isOpen, onRequestClose, appointment, doctor }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [count, setCount] = useState("");
  const theme = useTheme();

  const handleAddPrescription = () => {
    if (medicine && time && count) {
      const newPrescription = { medicine, time, count };
      setPrescriptions([...prescriptions, newPrescription]);
      setMedicine("");
      setTime("");
      setCount("");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = async () => {
    const formattedPrescriptions = prescriptions.map(
      (p) => `${p.medicine} - ${p.time} - ${p.count}`
    );
    try {
      let response = await postPrescription({
        id: appointment._id,
        prescriptions: formattedPrescriptions,
      });
      if (response.status === 200) {
        toast.success("Prescription submitted successfully");
        setPrescriptions([]);
        onRequestClose();
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="prescription-modal-title"
      aria-describedby="prescription-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            p: 1,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography
            id="prescription-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "white" }}
          >
            Prescription Details
          </Typography>
        </Box>
        <Typography id="prescription-modal-description" sx={{ mb: 2 }}>
          This prescription is from Dr. {doctor.name} at{" "}
          {doctor.currentWorkingHospital}, specialized in{" "}
          {doctor.expertise.name}.
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription, index) => (
              <TableRow key={index}>
                <TableCell>{prescription.medicine}</TableCell>
                <TableCell>{prescription.time}</TableCell>
                <TableCell>{prescription.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Medicine Name"
            value={medicine}
            onChange={(event) => setMedicine(event.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Time (e.g., Morning, Night)"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Count"
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPrescription}
            sx={{
              mt: 2,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Add Prescription
          </Button>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={onRequestClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PrescriptionModal;
