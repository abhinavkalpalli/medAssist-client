import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import "./CSS/starRating.css";
import toast from "react-hot-toast";
import { postRating } from "../../services/patient/apiMethods";

const StarRatingModal = ({ appointment, onClose }) => {
  const [rating, setRating] = useState(null);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async () => {
    if (rating) {
      try {
        const data = {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          rating: rating,
        };
        const response = await postRating(data);
        if (response.status === 200) {
          toast.success("Rating is submitted");
          onClose();
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        toast.error("Something went wrong");
      }
    } else {
      alert("Please select a rating.");
    }
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" component="h2" mb={2} align="center">
        Rate Your Experience
      </Typography>
      <div
        className="rating"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <input
          type="radio"
          id="star-5"
          name="star-radio"
          value="5"
          onChange={handleRatingChange}
        />
        <label htmlFor="star-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              pathLength="360"
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            ></path>
          </svg>
        </label>
        <input
          type="radio"
          id="star-4"
          name="star-radio"
          value="4"
          onChange={handleRatingChange}
        />
        <label htmlFor="star-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              pathLength="360"
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            ></path>
          </svg>
        </label>
        <input
          type="radio"
          id="star-3"
          name="star-radio"
          value="3"
          onChange={handleRatingChange}
        />
        <label htmlFor="star-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              pathLength="360"
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            ></path>
          </svg>
        </label>
        <input
          type="radio"
          id="star-2"
          name="star-radio"
          value="2"
          onChange={handleRatingChange}
        />
        <label htmlFor="star-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              pathLength="360"
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            ></path>
          </svg>
        </label>
        <input
          type="radio"
          id="star-1"
          name="star-radio"
          value="1"
          onChange={handleRatingChange}
        />
        <label htmlFor="star-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              pathLength="360"
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            ></path>
          </svg>
        </label>
      </div>
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ display: "block", mx: "auto" }}
      >
        Submit
      </Button>
    </Box>
  );
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
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export default StarRatingModal;
