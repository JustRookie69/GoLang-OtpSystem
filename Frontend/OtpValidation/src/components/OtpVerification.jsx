import React, { useState } from 'react';
import './OtpVerification.css';

const OtpVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Refs for OTP input fields
  const otpRefs = Array(6).fill(0).map(() => React.createRef());

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Converting phoneNumber to number as per your backend expectation
      const numericPhone = parseInt(phoneNumber, 10);
      
      // Send request with the format your backend expects
      const response = await fetch('http://localhost:8080/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Number: numericPhone }),
      });

      // Your backend doesn't return a response, so we won't try to parse it
      // Instead, just assume success if there's no network error
      setSuccess('OTP sent successfully! Check server logs for the code.');
      setStep(2);
    } catch (err) {
      setError('Failed to communicate with server. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Allow only digits
    value = value.replace(/\D/g, '');
    
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input when a digit is entered
      if (value && index < 5) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to auto-focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Convert phoneNumber and OTP to numbers as per your backend expectation
      const numericPhone = parseInt(phoneNumber, 10);
      const numericOtp = parseInt(otpValue, 10);
      
      // Send request with the format your backend expects
      const response = await fetch('http://localhost:8080/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserNumber: numericPhone,
          GenOtp: numericOtp
        }),
      });

      // Now that your backend responds correctly, parse the response
      try {
        const text = await response.text();
        
        // Debug what's being returned
        console.log("Response from server:", text);
        
        // Parse the JSON response if it exists
        const data = text && text.trim() ? JSON.parse(text) : null;
        
        if (!data) {
          throw new Error('Empty response from server');
        }
        
        if (!data.success) {
          throw new Error(data.message || 'OTP verification failed');
        }
        
        setSuccess('OTP verified successfully!');
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server: ' + parseError.message);
      }
      // Additional logic for successful verification
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    handleSendOTP();
  };

  return (
    <div className="otp-container">
      <h1>Phone Verification</h1>
      
      {step === 1 ? (
        <div className="phone-input-container">
          <div className="phone-field">
            <span className="country-code">+91</span>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              disabled={loading}
            />
          </div>
          <button 
            onClick={handleSendOTP} 
            disabled={loading || phoneNumber.length !== 10}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div className="otp-input-container">
          <p className="phone-display">OTP sent to +91 {phoneNumber}</p>
          <div className="otp-fields">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <div className="button-group">
            <button 
              onClick={handleVerifyOTP} 
              disabled={loading || otp.join('').length !== 6}
              className={loading ? 'loading primary' : 'primary'}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              onClick={handleResendOTP} 
              disabled={loading}
              className="secondary"
            >
              Resend OTP
            </button>
          </div>
          <button 
            className="text-button" 
            onClick={() => {
              setStep(1);
              setOtp(['', '', '', '', '', '']);
              setError('');
              setSuccess('');
            }}
          >
            Change Phone Number
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default OtpVerification;