import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import Swal from 'sweetalert2';
import { fetchDoctors, blockUnblockDoctor, verifyDoctorDocuments } from '../../services/admin/apiMethods';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Typography } from '@mui/material';
import DocumentModal from './DocumentModal';

const blueColor = '#2172d2';
const tealColor = '#17d5d1';

function DoctorsList() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const fetchData = async () => {
    const response = await fetchDoctors();
    console.log(response.data.data);
    if (response.status === 200) {
      setList(response.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber === 'prev') {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    } else if (pageNumber === 'next') {
      setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredList.length / itemsPerPage)));
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const changeStatus = async (id, status) => {
    const response = await blockUnblockDoctor(id, status);
    if (response.status === 200) {
      fetchData();
      toast.success(response.data.message);
    } else {
      toast.error('Failed to update doctor status');
    }
  };

  const handleVerifyDocuments = async () => {
    const response = await verifyDoctorDocuments(selectedDoctorId);
    if (response.status === 200) {
      fetchData();
      toast.success(response.data.message);
      setIsModalOpen(false);
    } else {
      toast.error('Failed to verify documents');
    }
  };

  const handleOpenModal = (documents, doctorId) => {
    setSelectedDocuments(documents);
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="m-4">
       <h1 className="text-3xl font-bold mb-4" style={{ color: blueColor,textAlign:'center' }}>DOCTORS</h1>
      <div className="flex items-center justify-between mb-4">
        <TextField
          id="table-search-doctors"
          label="Search for doctors"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '300px' }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="doctors table">
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: '#fff' }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Block/Unblock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item._id} style={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell style={{
                  backgroundColor: item.is_Blocked ? '#f56565' : tealColor,
                  color: '#fff'
                }}>
                  {item.is_Blocked ? 'Inactive' : 'Active'}
                </TableCell>
                <TableCell>{item.expertise?.name}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={item.documents_verified ? 'success' : 'info'}
                    onClick={() => handleOpenModal(item.documents, item._id)}
                  >
                    {item.documents_verified ? 'Verified' : 'Verify'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={item.is_Blocked ? 'success' : 'error'}
                    onClick={() => changeStatus(item._id, item.is_Blocked)}
                  >
                    {item.is_Blocked ? 'Unblock' : 'Block'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => paginate('prev')}
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          style={{ backgroundColor: blueColor, color: '#fff' }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </Button>
        {[...Array(Math.min(3, Math.ceil(filteredList.length / itemsPerPage))).keys()].map((index) => (
          <Button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            variant="contained"
            color={currentPage === index + 1 ? 'primary' : 'default'}
            style={{ backgroundColor: currentPage === index + 1 ? blueColor : '#e0e0e0', color: currentPage === index + 1 ? '#fff' : '#000' }}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => paginate('next')}
          variant="contained"
          color="primary"
          disabled={currentPage === Math.ceil(filteredList.length / itemsPerPage)}
          style={{ backgroundColor: blueColor, color: '#fff' }}
          className="mx-1"
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </Button>
      </div>
      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documents={selectedDocuments}
        onVerify={handleVerifyDocuments}
      />
    </div>
  );
}

export default DoctorsList;
