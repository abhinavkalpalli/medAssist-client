

export const userUrl={
    register:'/patient/register',
    otpverify:'/patient/otp-verification',
    forgotpassword:'/patient/forgotpassword',
    resetpassword:'/patient/resetpassword',
    doctorregister:'/doctor/register',
    doctorotpverify:'/doctor/otp-verification',
    doctorforgotpassword:'/doctor/forgotpassword',
    doctorresetpassword:'/doctor/resetpassword',
    patientLogin:'/patient/login',
    doctorLogin:'/doctor/login',
    adminSignup:'admin/register',
    adminLogin:'admin/login',
    editPatient:'/patient/editPatient',
    fetchDoctors:'/patient/doctors',
    getBookings:'/patient/bookings',
    postBooking:'/patient/postBooking',
    yourBooking:(patientId)=>`/patient/${patientId}/yourBooking`,
    cancelAppointment:(id)=>`/patient/cancelAppointment/${id}`,
    fetchPatient:'/patient/fetchpatient',
    setFavourite:'/patient/setFavourite',
    postRating:'/patient/postRating'
}
export const authUrl = {
    authUser: "/auth/patient",
    authAdmin: "/auth/admin",
    authDoctor: "/auth/doctor",
    resendOtp:'/auth/resendOtp'
};
export const adminUrl={
    adminotpverify:'/admin/otp-verification',
    fetch_patients:'/admin/patients',
    fetch_doctors:'/admin/doctors',
    adminforgotpassword:'/admin/forgotpassword',
    adminresetpassword:'/admin/resetpassword',
    blockUnblockdoctor:(userId)=>`/admin/doctor/${userId}/blockUnblock`,
    blockUnblockpatient:(userId)=>`/admin/patient/${userId}/blockUnblock`,
    verifyDoctorDocuments:(userId)=>`/admin/${userId}/verifyDocuments`,
    BookingList:'/admin/bookingList',
    Bookings:'/admin/bookings',
    updateFee:'/admin/updateFee',
    addExpertise:'/admin/addExpertise',
    expertise:'/admin/expertise',
    editExpertise:'/admin/editExpertise'

}
export const doctorUrl={
    editDoctor:'/doctor/editDoctor',
    uploadDocuments:'/doctor/uploadDocuments',
    deleteDocument:(email,index)=>`/doctor/deleteDocument/${email}/${index}`,
    slotUpdate:'/doctor/slotUpdate',
    fetchSlots:'/doctor/fetchSlots',
    fetchAppointments:'/doctor/appointments',
    fetchAllAppointments:'/doctor/allAppointments',
    postPrescription:'/doctor/prescription',
    fetchDoctor:'/doctor/fetchDoctor',
    patientHistory:'/doctor/patientHistory',
    updateBooking:'/doctor/updateBooking',
    slotUpdateDay:'/doctor/slotUpdateDay',

}