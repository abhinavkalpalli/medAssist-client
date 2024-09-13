import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Swal from "sweetalert2";
import {
  fetchPatients,
  blockUnblockPatient,
} from "../../services/admin/apiMethods";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";

const blueColor = "#2172d2";
const tealColor = "#17d5d1";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchData = async () => {
    const response = await fetchPatients();
    if (response.status === 200) {
      const filteredUsers = response.data.data.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filteredUsers);
      setIsLoading(false);
    } else {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const changeStatus = async (id, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${
        status === false ? "block" : "unblock"
      } this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status === false ? "block" : "unblock"} them!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await blockUnblockPatient(id, status);
        if (response.status === 200) {
          setUsers((prevList) =>
            prevList.map((user) =>
              user._id === id ? { ...user, is_Blocked: !status } : user
            )
          );
          toast.success(response.data.message);
        } else {
          toast.error("Failed to update user status");
        }
      } catch (error) {
        toast.error("An error occurred while updating the user status");
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber === "prev") {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    } else if (pageNumber === "next") {
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(users.length / usersPerPage))
      );
    } else {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return <h1 className="text-center text-2xl mt-10">Fetching users...</h1>;
  }

  return (
    <div className="m-4">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: blueColor, textAlign: "center" }}
      >
        PATIENTS
      </h1>

      <div className="flex items-center justify-between mb-4">
        <TextField
          id="table-search-users"
          label="Search for users"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: "#fff" }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ban/Unban</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user._id}
                style={{
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: user.is_Blocked ? "#f56565" : tealColor,
                    color: "#fff",
                  }}
                >
                  {user.is_Blocked ? "Inactive" : "Active"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.is_Blocked ? "success" : "error"}
                    onClick={() => changeStatus(user._id, user.is_Blocked)}
                  >
                    {user.is_Blocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center mt-4">
        <Button
          onClick={() => paginate("prev")}
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          style={{ backgroundColor: blueColor, color: "#fff" }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </Button>
        {[
          ...Array(Math.min(3, Math.ceil(users.length / usersPerPage))).keys(),
        ].map((index) => (
          <Button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            variant="contained"
            color={currentPage === index + 1 ? "primary" : "default"}
            style={{
              backgroundColor:
                currentPage === index + 1 ? blueColor : "#e0e0e0",
              color: currentPage === index + 1 ? "#fff" : "#000",
            }}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => paginate("next")}
          variant="contained"
          color="primary"
          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
          style={{ backgroundColor: blueColor, color: "#fff" }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default UsersList;
