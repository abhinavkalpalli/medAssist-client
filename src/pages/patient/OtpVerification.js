import React, { useState, useEffect } from 'react';
import OtpInput from '../../components/otpInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { otpverify, resendOtp } from '../../services/patient/apiMethods';
import { doctorotpverify } from '../../services/doctor/apiMethods';
import { adminotpverify } from '../../services/admin/apiMethods';
import './otpVerification.css';

const OtpVerification = () => {
  const [otp2, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpInput, setOtpInput] = useState('');
  const location = useLocation();
  const { email, otp, passwordReset, isDoctor, isAdmin } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    setOtpInput(otp);
  }, [otp]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpInput === otp2) {
      if (passwordReset && isDoctor) {
        navigate('/passwordReset', { state: { email, isDoctor:true } });
      } else if (passwordReset && isAdmin) {
        navigate('/passwordReset', { state: { email, isAdmin:true } });
      } else if (passwordReset) {
        navigate('/passwordReset', { state: { email } });
      } else {
        if (isDoctor) {
          const response = await doctorotpverify({ email });
          if (response.status === 200) {
            navigate('/login');
          }
        } else if (isAdmin) {
          const response = await adminotpverify({ email });
          if (response.status === 200) {
            navigate('/admin/login');
          }
        } else {
          const response = await otpverify({ email });
          if (response.status === 200) {
            navigate('/login');
          }
        }
      }
    } else {
      setError('Otp mismatch');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({email});
      if (response.status === 200) {
        setOtpInput(response.data.otp); 
        setTimeLeft(60);
      }
    } catch (error) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      {error && (
        <div className="text-red-600 text-sm font-extralight py-2">
          ! {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <OtpInput length={6} onChangeOtp={handleOtpChange} />
        <button type="submit" disabled={timeLeft === 0}>
          {timeLeft > 0 ? `Verify OTP (${timeLeft}s)` : 'Reset OTP'}
        </button>
      </form>
      {timeLeft === 0 && (
        <button onClick={handleResendOtp}>Resend OTP</button>
      )}
    </div>
  );
};

export default OtpVerification;
