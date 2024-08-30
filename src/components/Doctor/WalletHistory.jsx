import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Nodata from "../ui/Nodata";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, isNegative }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: isNegative ? "#ffcccc" : theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: isNegative ? "#ffcccc" : "inherit",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function WalletHistory() {
  const patient = useSelector((state) => state.user.userData);
  const doctor = useSelector((state) => state.doctor.doctorData);
  const User = patient || doctor;
  const [walletHistory, setWalletHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const sortedWalletHistory = [...User.WalletHistory].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    setWalletHistory(sortedWalletHistory);
  }, [User.WalletHistory]);

  const totalPages = Math.ceil(walletHistory.length / rowsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant="contained"
          style={{
            margin: "0 4px",
            backgroundColor: i === currentPage ? "#0000FF" : "#f0f0f0",
            color: i === currentPage ? "#fff" : "#000",
          }}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedHistory = walletHistory.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div>
      {walletHistory.length < 1 ? (
        <Nodata />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="wallet history table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell align="right">Amount</StyledTableCell>
                  <StyledTableCell align="right">Message</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHistory.map((entry, index) => (
                  <StyledTableRow
                    key={index}
                    isNegative={String(entry.amount).includes("-")}
                  >
                    <StyledTableCell component="th" scope="row">
                      {entry.date}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {entry.amount}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {entry.message}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center mt-4">
            <Button
              onClick={handlePreviousPage}
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#0000FF", color: "#fff" }}
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
              style={{ backgroundColor: "#0000FF", color: "#fff" }}
              disabled={currentPage === totalPages}
              className="mx-2"
            >
              <MdOutlineKeyboardDoubleArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default WalletHistory;
