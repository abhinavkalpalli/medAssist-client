import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { eachDayOfInterval } from "date-fns";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  fetchSlots,
  slotUpdate,
  slotUpdateDay,
} from "../../services/doctor/apiMethods";

const SlotManage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [breakTime, setBreakTime] = useState(10);
  const [selectedDateForView, setSelectedDateForView] = useState(null);
  const [fetchedShifts, setFetchedShifts] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const doctor = useSelector((state) => state.doctor.doctorData);

  const handleCreateSlots = async () => {
    // Validate input fields
    if (!startDate || !endDate || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Parse the times for comparison
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    if (start >= end) {
      toast.error("Start time must be earlier than end time");
      return;
    }

    // Create slots data array
    const slotsData = eachDayOfInterval({
      start: startDate,
      end: endDate,
    }).map((day) => ({
      doctorId: doctor._id,
      date: day.toISOString().split("T")[0], // Format date for the backend
      startTime,
      endTime,
      duration,
      breakTime,
    }));

    try {
      const response = await slotUpdate(slotsData);

      if (response.status === 200) {
        toast.success("Slots created successfully");
        fetchAndDisplaySlots();
      } else {
        const errorMessage = response.data?.message || "Failed to create slots";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating slots:", error);
      toast.error("Error creating slots");
    }
  };

  const fetchAndDisplaySlots = async () => {
    if (!selectedDateForView) return;

    const formattedDate = selectedDateForView.toISOString().split("T")[0];

    try {
      const fetchedSlotsResponse = await fetchSlots({
        id: doctor._id,
        date: formattedDate,
      });
      const fetchedSlots = fetchedSlotsResponse.data.Slots.shifts || [];
      setFetchedShifts(fetchedSlots);

      setSelectedShifts(
        fetchedSlots.map((shift) => ({ shift, selected: true }))
      );
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Error fetching slots");
    }
  };

  const handleSelectShift = (shift) => {
    setSelectedShifts((prevShifts) =>
      prevShifts.map((s) =>
        s.shift === shift ? { ...s, selected: !s.selected } : s
      )
    );
  };

  const handleUpdateSelectedSlots = async () => {
    const slotsToUpdate = selectedShifts
      .filter((s) => s.selected)
      .map((s) => s.shift);

    try {
      const response = await slotUpdateDay({
        doctorId: doctor._id,
        date: selectedDateForView.toISOString().split("T")[0],
        slots: slotsToUpdate,
      });

      if (response.status === 200) {
        toast.success("Slots updated successfully");
        fetchAndDisplaySlots();
      } else {
        const errorMessage = response.data?.message || "Failed to update slots";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating slots:", error);
      toast.error("Error updating slots");
    }
  };

  useEffect(() => {
    fetchAndDisplaySlots();
  }, [selectedDateForView]);

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto my-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Toaster position="top-center" />
      <motion.h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Manage Slots
      </motion.h2>

      <div className="flex mb-6">
        <div className="w-1/2 pr-2">
          <h3 className="font-semibold text-lg mb-2">Select Date Range</h3>
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="w-1/2 pl-2">
          <h3 className="font-semibold text-lg mb-2">
            Select Date to View Slots
          </h3>
          <DatePicker
            selected={selectedDateForView}
            onChange={(date) => setSelectedDateForView(date)}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex mb-6">
        <div className="w-1/2 pr-2">
          <h3 className="font-semibold text-lg mb-2">Start Time</h3>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="w-1/2 pl-2">
          <h3 className="font-semibold text-lg mb-2">End Time</h3>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex mb-6">
        <div className="w-1/2 pr-2">
          <h3 className="font-semibold text-lg mb-2">Duration (minutes)</h3>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="w-1/2 pl-2">
          <h3 className="font-semibold text-lg mb-2">Break Time (minutes)</h3>
          <input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="text-center mb-6">
        <button
          onClick={handleCreateSlots}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Create Slots
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4  text-center">
          Available Slots
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetchedShifts.length > 0 ? (
            selectedShifts.map(({ shift, selected }, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg cursor-pointer ${
                  selected ? "bg-blue-100" : "bg-gray-100"
                }`}
                onClick={() => handleSelectShift(shift)}
              >
                {shift}
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center p-2 bg-red-100 rounded-lg">
              No slots available for the selected date
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleUpdateSelectedSlots}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Update Selected Slots
        </button>
      </div>
    </motion.div>
  );
};

export default SlotManage;
