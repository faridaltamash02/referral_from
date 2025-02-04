import React, { useState, useEffect, useRef } from 'react';
import apiService from '../common/services/apiService';

function OtpForm({onValueChange, formData, isExpired}) {
  const [otpValue, setOtpValue] = useState({
    verification: '',
  });
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(45);
  const intervalRef = useRef(null); // Store the interval ID
  const [isVerifyBtnDisabled, setIsVerifyBtnDisabled] = useState(false);
  const [isResendBtnDisabled, setisResendBtnDisabled] = useState(true);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  if(isExpired){
    setIsVerifyBtnDisabled(true);
    setisResendBtnDisabled(false);
  }
  const [errorMessages, setErrorMessages] = useState('');
  const { phoneNumber, emailId } = formData;
  
  // useEffect(() => {
  //   let interval;
  //   //start timer
  //   if(timer > 0){
  //     interval = setInterval(() => {
  //       setTimer((prevTimer) => prevTimer - 1);
  //     }, 1000);
  //   }else{
  //     setIsButtonDisabled(isOtpVerified?false:true);
  //   }
  //   return () => clearInterval(interval);
  // },[timer])

  useEffect(() => {
    let interval;
    if (timer > 0) {
      intervalRef.current = setInterval(() => { // Assign interval ID to ref = setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer - 1;
          if (newTimer === 0) {
            // Trigger your event here.  Examples:
            console.log("Timer reached zero!");
            // Or call a function:
            handleTimerExpiration();
          }
          return newTimer;
        });
      }, 1000);
    } 
  
    return () => clearInterval(intervalRef.current);
  }, [timer]);
  
  
  const handleTimerExpiration = () => {
      //Perform your task here, like showing a message
      //console.log("Verification code expired. Please click Resend code.");
      setIsVerifyBtnDisabled(false);
      setisResendBtnDisabled(false);
  }
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resendOtp = (e) => {
    e.preventDefault();
    const phoneNumberValue = phoneNumber.replace(/\D/g, "");
    console.log(allFieldPresent+"OTP");
    let allFieldPresent = Object.values(formData).every((value) => value !== '') && isValidEmail(formData.emailId) && phoneNumberValue.length == 10;
    if (allFieldPresent) {
      
      apiService.post(`/rest/leadSource/send_otp?recipientPhoneNumber=${phoneNumberValue}&emailId=${emailId}`, {}).then((response) => {
        console.log(response);
        if (!response.data.error) {
          if (response.data.resultObject.otpStatus.toLowerCase() == 'delivered' || response.resultObject.resultObject.toLowerCase() == "success") {
            setIsVerifyBtnDisabled(false);
            setisResendBtnDisabled(true);
            setOtpValue({ verification: '' }); // Clear field here
            setIsOtpVerified(false);
            setTimer(45);
          }
        }
      })
    }
  }


  const handleChange = (e) => {
    setOtpValue({ ...otpValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!otpValue.verification){
      setErrorMessages(
        "Please enter verification code"
      );
      return;
    }
    const phoneNumberValue = phoneNumber.replace(/\D/g, "");
    // Here you would typically make an API call to save the data
    //api for OTP validation
    //rest/leadSource/verifyOtp?phoneNumber=${phoneNumber}&otp=${otpVal}`
    apiService.post(`/rest/leadSource/verifyOtp?phoneNumber=${phoneNumberValue}&otp=${otpValue.verification}`).then((response) => {
      if(!response.data.error){
        clearInterval(intervalRef.current);
        onValueChange(true, otpValue.verification);
        setIsOtpVerified(true);
      }else{
        let invalidToken = "Invalid otp, please enter valid 6 digits otp";
        if (
          response.data.error.message
            .toLowerCase()
            .includes(invalidToken.toLowerCase())
        ) {
          setErrorMessages(
            "Invalid verification code, please enter valid 6 digits verification code"
          );
        } else if (
          response.data.error.code == "400" ||
          response.data.error.message == "Invalid email"
        ) {
           setErrorMessages(
            "Invalid email. Please enter valid email."
          );
          setTimeout(() => {
            redirectTo404()
          }, 1000);
        }else if(response.data.error.message.toLowerCase().includes('verification code expired')){
            setErrorMessages(response.data.error.message);
            clearInterval(intervalRef.current);
            setIsVerifyBtnDisabled(true);
            setisResendBtnDisabled(false);
          } else {
            setErrorMessages(response.data.error.message);
        }
      }
    })
    
  };

  const redirectTo404 = () => {
    setTimeout(() => {
      window.location.href = `${window.location.origin}/404`;
    }, 1000);
  };

  return (
    <div>
      <div className="flex gap15 pos-rel">
        <div className="form-group flex alignE">
          <input
            className="nf-control"
            type="text"
            id="verification"
            name="verification"
            placeholder="Enter verification code"
            value={formData.verification}
            onChange={handleChange}
            required
          />
          {isOtpVerified && <div className="flex"><img decoding="async" src="https://staging.newfi.com/wp-content/uploads/2023/10/download.png" /><span className="fs12s">Verified</span></div>}

        </div>
        {!isOtpVerified && <div className='flex alignC justifyC gap15'>
          <div>
            <button className="nf-btn nf-btn-priamry sm" type="submit" disabled={isVerifyBtnDisabled} onClick={handleSubmit} >Verify Code</button>
          </div>
          <div>
            <div className="pos-rel"><button className="nf-btn nf-btn-priamry sm" onClick={resendOtp} disabled={isResendBtnDisabled}>Resend verfication code</button>
              {((timer > 0 || !isVerifyBtnDisabled) && timer != 0) && <div className="nf-error-text textE w-100">{timer} seconds</div>}
            </div>
          </div>
        </div>
        }
      </div>
      <div className="nf-error-text">{errorMessages}</div>
  </div>
  );
}

export default OtpForm;