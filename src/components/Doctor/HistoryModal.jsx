import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const HistoryModal = ({ isOpen, onRequestClose, history }) => {
  const theme = useTheme();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const headerStyle = {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    p: 2,
    borderRadius: 1,
    textAlign: "center",
    mb: 2,
  };

  // Function to parse prescription string into an object
  const parsePrescription = (prescription) => {
    const parts = prescription.split(" - ");
    return {
      medicine: parts[0],
      time: parts[1],
      count: parts[2],
    };
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="patient-history-title"
      aria-describedby="patient-history-description"
    >
      <Box sx={modalStyle}>
        <Button
          onClick={onRequestClose}
          variant="contained"
          color="error"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          X
        </Button>
        <Typography
          id="patient-history-title"
          variant="h6"
          component="h2"
          sx={headerStyle}
        >
          Patient History
        </Typography>
        <Box sx={{ mt: 2 }}>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" component="div">
                    <strong>Date:</strong>{" "}
                    {new Date(entry.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Shift:</strong> {entry.shift}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Prescription:</strong>
                    {entry.Prescription && entry.Prescription.length > 0 ? (
                      <TableContainer component={Paper} sx={{ mt: 1 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Medicine</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Time</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Count</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {entry.Prescription.map((pres, idx) => {
                              const { medicine, time, count } =
                                parsePrescription(pres);
                              return (
                                <TableRow key={idx}>
                                  <TableCell>{medicine}</TableCell>
                                  <TableCell>{time}</TableCell>
                                  <TableCell>{count}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography>No prescription available</Typography>
                    )}
                  </Typography>
                </CardContent>
                {index < history.length - 1 && <Divider />}
              </Card>
            ))
          ) : (
            <Typography>No history available</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default HistoryModal;
