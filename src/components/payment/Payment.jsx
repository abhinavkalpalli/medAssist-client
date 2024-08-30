import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Profileholder from "../../assets/check1.jpg";
import ProfileHolder2 from "../../assets/check2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../const/url";
import { postBooking, fetchPatient } from "../../services/patient/apiMethods";
import { updateReduxUser } from "../../utils/reducers/userReducer";
import logo from "../../assets/Med Assist.png";

function PaymentProcess() {
  const User = useSelector((state) => state.user.userData);
  const patientId = User._id;
  const location = useLocation();
  const { selectedDoctor, selectedDate, selectedShift } = location.state;
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("online");
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const FetchPatient = async () => {
    const userResponse = await fetchPatient({ patientId });
    dispatch(updateReduxUser({ userData: userResponse.data.patient }));
  };
  const handleBooking = async () => {
    const inputDate = new Date(selectedDate);
    const isoDateString = inputDate.toISOString().split("T")[0];
    const data = {
      doctorId: selectedDoctor._id,
      date: isoDateString,
      shift: selectedShift,
      patientId: User._id,
      Fee: selectedDoctor.Fee,
    };
    const response = await postBooking(data);
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Booking Successful",
        text: "Your appointment has been booked!",
        showConfirmButton: false,
        timer: 1500,
      });
      FetchPatient();
      Navigate("/patient/profile");
    }
  };
  const renderFacilities = () => {
    return (
      <ul className="list-disc pl-5">
        <li>Video Call Consultation</li>
        <li>Chat Support</li>
        <li>Call with Experienced Doctor</li>
        <li>Share your feelings and problems</li>
      </ul>
    );
  };

  const handlePaymentOptionSelect = (option) => {
    setSelectedPaymentOption(option);
  };

  const handleProceed = async () => {
    let fee = 0;

    if (User?.Wallet > 0) {
      if (User.Wallet >= selectedDoctor.Fee) {
        fee = 0;
      } else {
        fee = selectedDoctor.Fee - User.Wallet;
      }
    } else {
      fee = selectedDoctor.Fee;
    }
    if (fee === 0) {
      handleBooking();
      return;
    }
    const data = {
      doctorId: selectedDoctor._id,
      userId: User._id,
      date: selectedDate.toISOString().split("T")[0],
      shift: selectedShift,
      Fee: fee,
    };
    if (selectedPaymentOption === "online") {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/patient/create-payment`,
          data
        );
        const { order } = response.data;
        const options = {
          key: "",
          amount: order.amount,
          currency: "INR",
          name: "MedAssist",
          description: "Test Transaction",
          image: logo,
          order_id: order.id,
          handler: async (response) => {
            try {
              const result = await axios.post(
                `${BASE_URL}/api/patient/verify-payment`,
                {
                  response,
                  order,
                }
              );

              if (result.data.paid) {
                Swal.fire({
                  icon: "success",
                  title: "Payment Verified!",
                  text: "Your payment has been successfully verified. Booked the slot.",
                })
                  .then(() => {
                    handleBooking();
                  })
                  .catch((err) => {
                    throw err;
                  });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Payment Failed",
                  text: "Payment could not be verified. Please try again.",
                });
              }
            } catch (error) {
              console.error(error);
              Swal.fire({
                icon: "error",
                title: "Payment Error",
                text: "There was an error processing your payment. Please try again.",
              });
            }
          },
          prefill: {
            name: User.name,
            email: User.email,
            contact: User.phone,
          },
          notes: {
            address: "MedAssist",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Order Error",
          text: "There was an error creating the order. Please try again.",
        });
      }
    } else {
      console.log("redirecting to wallet");
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col justify-between h-full">
      <h2 className="text-3xl font-semibold mb-4 text-blue-800">
        Confirm Booking
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 flex justify-between flex-wrap">
        <div className="w-1/2">
          <div className="w-full mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Doctor Details
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> DR{" "}
              {selectedDoctor?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Experience:</span>{" "}
              {selectedDoctor?.experienceYears} years
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Expertise:</span>{" "}
              {selectedDoctor?.expertise.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Education:</span>{" "}
              {selectedDoctor?.education}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Appointment Details
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold">Date:</span>{" "}
              {selectedDate?.toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Time:</span> {selectedShift}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Payment Details
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold">Amount:</span>{" "}
              {selectedDoctor.Fee}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Facilities Provided
            </h3>
            {renderFacilities()}
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <img
            src={Profileholder}
            alt=""
            className="w-[350px] h-[200px] mb-6 hidden md:block"
          />
          <img
            src={ProfileHolder2}
            alt=""
            className="w-[350px] h-[200px] hidden md:block"
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Select Payment Option
            </h2>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="online"
                  checked={selectedPaymentOption === "online"}
                  onChange={() => handlePaymentOptionSelect("online")}
                />
                Pay Online
              </label>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 ${
                  selectedPaymentOption
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white rounded`}
                onClick={handleProceed}
                disabled={!selectedPaymentOption}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentProcess;
