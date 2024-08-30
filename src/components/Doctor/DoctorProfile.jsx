import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiUpload, FiTrash } from "react-icons/fi";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "../../hooks/cloudinary";
import { editDoctor } from "../../services/doctor/apiMethods";
import { updateDoctor } from "../../utils/reducers/doctorReducer";
import { expertise } from "../../services/admin/apiMethods";
import profilePlaceholder from "../../assets/doctor.jpg";

function DoctorProfile() {
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [education, setEducation] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [currentWorkingHospital, setWorkingHospital] = useState("");
  const [workingHospitalContact, setWorkingHospitalContact] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch();
  const Doctor = useSelector((state) => state?.doctor?.doctorData);

  const fetchData = async () => {
    const response = await expertise();
    if (response.status === 200) {
      setSpecialization(response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Doctor) {
      setName(Doctor.name);
      setEmail(Doctor.email);
      setPhoneNumber(Doctor.phone);
      setSelectedExpertise(Doctor.expertise?._id);
      setExperienceYears(Doctor.experienceYears);
      setWorkingHospital(Doctor.currentWorkingHospital);
      setWorkingHospitalContact(Doctor.workingHospitalContact);
      setEducation(Doctor.education);
      setDob(Doctor.dateOfBirth ? Doctor.dateOfBirth.split("T")[0] : "");
      setGender(Doctor.gender);
      setSelectedImage(Doctor.photo || "");
    }
  }, [Doctor]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const previewImageUrl = URL.createObjectURL(file);
    setSelectedImage(previewImageUrl);
    setIsChanged(true);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setIsChanged(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (phone.trim() === "" || !/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number is required and must be 10 digits";
    }
    if (dateOfBirth.trim() === "") {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    let photoUrl = Doctor?.photo;
    if (imageFile) {
      const imgUrl = await uploadImageToCloudinary(imageFile);
      photoUrl = imgUrl;
    }

    const formData = {
      name,
      email,
      phone,
      experienceYears,
      currentWorkingHospital,
      dateOfBirth,
      photo: photoUrl,
      gender,
      workingHospitalContact,
      expertise: selectedExpertise,
      education,
    };
    try {
      const response = await editDoctor(formData);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        dispatch(updateDoctor({ doctorData: response.data }));
        setIsChanged(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Remove Profile image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const formData = {
        name,
        email,
        phone,
        experienceYears,
        currentWorkingHospital,
        dateOfBirth,
        photo: "",
        gender,
        workingHospitalContact,
        expertise: selectedExpertise,
        education,
      };

      try {
        const response = await editDoctor(formData);
        if (response?.status === 200) {
          toast.success("Profile updated successfully");
          dispatch(updateDoctor({ doctorData: response.data }));
          setIsChanged(false);
          toast.success("Profile Picture removed successfully.");
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } else {
          toast.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Request error:", error);
        toast.error("Failed to update profile");
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-8">
            <img
              src={selectedImage || profilePlaceholder}
              className="w-32 h-32 bg-gray-200 rounded-full mb-4 object-cover"
              alt="Profile"
            />
            <div className="flex items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                <FiUpload className="text-lg" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              {selectedImage && selectedImage !== profilePlaceholder && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="ml-4 bg-red-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                >
                  <FiTrash className="text-lg" />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
                value={name}
                onChange={handleChange(setName)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="expertise"
                className="block text-gray-700 font-semibold mb-2"
              >
                Expertise
              </label>
              <select
                id="expertise"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={selectedExpertise}
                onChange={handleChange(setSelectedExpertise)}
              >
                <option value="">Select expertise</option>
                {specialization.map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-semibold mb-2"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handleChange(setPhoneNumber)}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="experienceYears"
                className="block text-gray-700 font-semibold mb-2"
              >
                Experience (Years)
              </label>
              <input
                type="number"
                id="experienceYears"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your experience in years"
                value={experienceYears}
                onChange={handleChange(setExperienceYears)}
              />
            </div>
            <div>
              <label
                htmlFor="currentWorkingHospital"
                className="block text-gray-700 font-semibold mb-2"
              >
                Current Working Hospital
              </label>
              <input
                type="text"
                id="currentWorkingHospital"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter your current working hospital"
                value={currentWorkingHospital}
                onChange={handleChange(setWorkingHospital)}
              />
            </div>
            <div>
              <label
                htmlFor="workingHospitalContact"
                className="block text-gray-700 font-semibold mb-2"
              >
                Hospital Contact Number
              </label>
              <input
                type="text"
                id="workingHospitalContact"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="Enter hospital contact number"
                value={workingHospitalContact}
                onChange={handleChange(setWorkingHospitalContact)}
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-gray-700 font-semibold mb-2"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={dateOfBirth}
                onChange={handleChange(setDob)}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-gray-700 font-semibold mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={gender}
                onChange={handleChange(setGender)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="education"
                className="block text-gray-700 font-semibold mb-2"
              >
                Education
              </label>
              <select
                id="education"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={education}
                onChange={handleChange(setEducation)}
              >
                <option value="">Select education level</option>
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="DO">DO</option>
                <option value="PhD">PhD</option>
                <option value="DNB">DNB</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={!isChanged}
              className={`${
                isChanged
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorProfile;
