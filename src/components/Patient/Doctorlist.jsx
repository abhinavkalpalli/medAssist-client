import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  bookings,
  findDoctors,
  setFavouriteDoctor,
} from "../../services/patient/apiMethods";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { updateReduxUser } from "../../utils/reducers/userReducer";
import { RiStarSFill, RiStarSLine } from "react-icons/ri";
import { expertise } from "../../services/admin/apiMethods";

Modal.setAppElement("#root");

function DoctorList() {
  const location = useLocation();
  const { Doctor } = location.state || {};
  const [doctors, setDoctors] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  const getDate = new Date();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.user.userData);
  const isFavoritePage =
    new URLSearchParams(location.search).get("favorite") === "true";
  const [favourites, setFavourites] = useState(User.favourite_doctors || []);
  getDate.setDate(getDate.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(getDate);
  const [doctorBookings, setDoctorBookings] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [shifts, setShifts] = useState([]);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  const fetchData = async () => {
    const response = await expertise();
    if (response.status === 200) {
      setSpecializations(response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [
    currentPage,
    experienceFilter,
    genderFilter,
    searchQuery,
    selectedExpertise,
  ]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (Doctor) {
        setSelectedDoctor(Doctor);
        await getDoctorBookings(Doctor._id);
        setIsModalOpen(true);
      }
    };
    fetchDoctorDetails();
  }, [Doctor]);

  const fetchDoctors = async () => {
    const data = {
      page: currentPage,
      limit: itemsPerPage,
      experience: experienceFilter,
      gender: genderFilter,
      expertise: selectedExpertise,
    };
    const response = await findDoctors(data);
    setDoctors(response.data.data.doctors);
    setTotalPages(response.data.data.totalPages);
  };

  const getDoctorBookings = async (doctorId) => {
    const response = await bookings({ doctorId });
    const formattedBookings = response.data.List.map((booking) => ({
      ...booking,
      date: new Date(booking.date),
    }));
    setDoctorBookings(formattedBookings);
    setDoctorSlots(response.data.Slots);
    const selectedDateISO = selectedDate.toISOString().split("T")[0];
    const matchingSlots = response.data.Slots.filter((item) => {
      const itemDateString = item.date.split("T")[0];
      return itemDateString === selectedDateISO;
    })
      .map((item) => item.shifts)
      .flat();

    setShifts(matchingSlots);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBookSlot = async (doctor) => {
    setSelectedDoctor(doctor);
    await getDoctorBookings(doctor._id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setSelectedShift("");
  };

  const handleShiftSelect = (shift) => {
    setSelectedShift(shift);
  };

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
    setSelectedShift("");
  };
  const isFavourite = (doctorId) => {
    return favourites.some(
      (favourite) => favourite.doctorId.toString() === doctorId.toString()
    );
  };
  const setFavourite = async (doctor) => {
    const response = await setFavouriteDoctor({
      id: User._id,
      doctorId: doctor._id,
      status: true,
    });
    if (response.status === 200) {
      setFavourites(response.data.favourite_doctors);
      dispatch(
        updateReduxUser({
          userData: {
            ...User,
            favourite_doctors: response.data.favourite_doctors,
          },
        })
      );
    }
  };
  const setUnFavourite = async (doctor) => {
    const response = await setFavouriteDoctor({
      id: User._id,
      doctorId: doctor._id,
      status: false,
    });
    if (response.status === 200) {
      setFavourites(response.data.favourite_doctors);
      dispatch(
        updateReduxUser({
          userData: {
            ...User,
            favourite_doctors: response.data.favourite_doctors,
          },
        })
      );
    }
  };
  const filteredDoctors = doctors?.filter((doctor) => {
    const isFavouriteDoctor = isFavoritePage ? isFavourite(doctor._id) : true;
    return (
      (searchQuery === "" ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      isFavouriteDoctor
    );
  });

  const getAvailableShifts = (doctorSlots, selectedDate) => {
    const availableSlots = doctorSlots.find(
      (slot) =>
        new Date(slot.date).toDateString() === selectedDate.toDateString()
    );

    return availableSlots ? availableSlots.shifts : [];
  };

  return (
    <div>
      {isFavoritePage && favourites.length == 0 ? (
        <p className="text-lg font-semibold text-gray-500">
          No favorite doctors found.
        </p>
      ) : (
        <div className="flex">
          <div className="w-1/4 p-6 bg-gray-100 h-screen sticky top-0">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#1E3A8A]">
                Filters
              </h2>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Experience
                </label>
                <select
                  value={experienceFilter}
                  onChange={(e) =>
                    setExperienceFilter(parseInt(e.target.value) || "")
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-[#1E3A8A]"
                >
                  <option value="">All</option>
                  <option value="2">2 years</option>
                  <option value="5">5 years</option>
                  <option value="8">8 years</option>
                  <option value="10">10 years</option>
                  <option value="12">12 years</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-[#1E3A8A]"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Specialization
                </label>
                <select
                  value={selectedExpertise} // Use selectedExpertise here
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-[#1E3A8A]"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((expertise) => (
                    <option key={expertise._id} value={expertise._id}>
                      {expertise.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-[#1E3A8A]"
                  placeholder="Search by name"
                />
              </div>
            </div>
          </div>
          <div className="w-3/4 p-6">
            <div className="flex flex-wrap gap-6">
              {filteredDoctors?.map((doctor) => {
                return (
                  <div
                    key={doctor._id}
                    className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={doctor.photo || "/assets/doc.png"}
                      alt={doctor.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#1E3A8A]">
                        DR {doctor.name}
                      </h3>
                      <p className="text-gray-700">
                        EXPERTISE : {doctor.expertise.name}
                      </p>
                      <p className="text-gray-500">
                        EXPERIENCE : {doctor.experienceYears} years
                      </p>
                      <p className="text-gray-500">
                        EDUCATION : {doctor.education}
                      </p>
                      <p className="text-gray-500">GENDER : {doctor.gender}</p>
                      <div className="rating mt-2 flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className="text-2xl">
                            {i <= doctor.rating ? (
                              <RiStarSFill style={{ color: "#FFD700" }} />
                            ) : (
                              <RiStarSLine
                                style={{
                                  color: "black",
                                  backgroundColor: "white",
                                }}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleBookSlot(doctor)}
                          className="px-3 py-2 bg-[#1E3A8A] text-white rounded hover:bg-[#1E3A8A]/80"
                        >
                          Book Slot
                        </button>
                        <button
                          onClick={() =>
                            isFavourite(doctor._id)
                              ? setUnFavourite(doctor)
                              : setFavourite(doctor)
                          }
                          className="ml-4 text-xl"
                        >
                          {isFavourite(doctor._id) ? (
                            <FaHeart color="red" />
                          ) : (
                            <CiHeart />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-[#1E3A8A]/80 disabled:opacity-50"
              >
                <MdOutlineKeyboardDoubleArrowLeft />
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-[#D1D5DB] text-gray-700"
                  } rounded hover:bg-[#1E3A8A]/80 hover:text-white`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-[#1E3A8A]/80 disabled:opacity-50"
              >
                <MdOutlineKeyboardDoubleArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Booking Modal"
        className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4 text-[#1E3A8A]">
            Book Appointment
          </h2>
          {selectedDoctor && (
            <>
              <h3 className="text-lg font-semibold text-[#1E3A8A]">
                DR {selectedDoctor.name}
              </h3>
              <p className="text-gray-700">
                EXPERTISE : {selectedDoctor.expertise.name}
              </p>
              <p className="text-gray-500">
                EXPERIENCE : {selectedDoctor.experienceYears} years
              </p>
              <p className="text-gray-500">EDUCATION : {selectedDoctor.education}</p>
              <p className="text-gray-500">GENDER : {selectedDoctor.gender}</p>
              <p className="text-gray-500">FEE : {selectedDoctor.Fee}</p>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={getDate}
                  maxDate={endDate}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-[#1E3A8A]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Available Slots
                </label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2">
                    {shifts.map((shift) => {
                      const isSlotBooked = doctorBookings.some(
                        (booking) =>
                          booking.date.toDateString() ===
                            selectedDate.toDateString() &&
                          booking.shift === shift
                      );

                      const isSlotAvailable = getAvailableShifts(
                        doctorSlots,
                        selectedDate
                      ).includes(shift);

                      const buttonClass = `px-4 py-2 rounded cursor-pointer ${
                        isSlotBooked
                          ? "bg-[#B91C1C] text-white"
                          : isSlotAvailable
                          ? selectedShift === shift
                            ? "bg-[#1E40AF] text-white"
                            : "bg-[#3B82F6] text-white"
                          : "bg-[#9CA3AF] text-gray-500 cursor-not-allowed"
                      }`;

                      return (
                        <div key={shift} className="relative group">
                          <button
                            onClick={() => handleShiftSelect(shift)}
                            className={buttonClass}
                            disabled={!isSlotAvailable || isSlotBooked}
                          >
                            {shift}
                          </button>
                          {isSlotBooked && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm p-1 rounded hidden group-hover:block">
                              Slot is already booked
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Link
                  to="/patient/payment"
                  state={{
                    selectedDoctor,
                    selectedDate,
                    selectedShift,
                  }}
                >
                  <button
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Book
                  </button>
                </Link>
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-[#9CA3AF] text-white rounded hover:bg-[#6B7280]"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DoctorList;
