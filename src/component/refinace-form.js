import React, { useState, useEffect } from 'react';
import OtpForm from './otp-form';
import CommonConstants from '../common/constants';
import Util from '../common/util';
import GaConnector from '../common/components/ga-connector';
import apiService from '../common/services/apiService';
import OverlayLoader from '../common/components/loader';
import Consent from './consent';
import axios from 'axios';


function RefinaceForm(data) {
  const formType = data.loanType;
  //const [formType, setFormType] = useState(formType);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailId: '',
    referralPropertyState: '',
  });
  const [isSubmitBtnsEnabled, setIsSubmitBtnEnabled] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' })
  const [allfieldValid, setAllFieldValid] = useState(false);
  const [respErrorMsg, setRespErrorMsg] = useState('');

  const [prevFormData, setPrevFormData] = useState(null);
  const [otpKey, setOtpKey] = useState(0); // Key for OtpForm component
  const util = new Util();
  const [user, setUser] = useState({});
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [otpFieldVal, setOtpFieldVal] = useState('');

  const [stateList, setStateList] = useState([]);
  const constants = new CommonConstants();
  const [lat, setlat] = useState('');
  const [lon, setlon] = useState('');
  const [uid, setUid] = useState('');
  let dynamicURL = window.location.origin.includes('staging') ? 'https://staging.newfi.com/' : 'https://newfi.com/';
  const API_URL = dynamicURL || 'https://staging.newfi.com/';

  useEffect(() => {
    //to fetch approved states states == to uncoment once merged in newfi site
    // fetch('https://uat.newfi.com/rest/states/newfi_approved_states')
    apiService.get('/rest/states/newfi_approved_states').then(response => {
      if (!response.error) {
        if (response?.data?.resultObject)
          setStateList(response?.data?.resultObject);
      }
    }).catch(error => { console.error('There was an error!', error); });
    util.getCordinates().then(resp => {
      setlat(resp.lat);
      setlon(resp.lon)
    }).catch(e => console.log(e))
  }, [])

  const enableSubmitButton = (value, optValue) => {
    setIsSubmitBtnEnabled(value);
    setOtpFieldVal(optValue);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    //format teh phone input
    if (e.target.name == 'phoneNumber') {
      setFormData({ ...formData, [e.target.name]: util.formatPhoneNumber(e.target.value) });
    }
  };

  // const handleValidation = (e) => {
  //   //email validation
  //   const { name, value } = e.target;
  //   let errorMessage = {};
  //   if (name === 'emailId') {
  //     setErrors((prevErrors) => ({ ...prevErrors, email: util.validateEmail(e.target.value) ? '' : 'Please enter a valid email address.', }));
  //   }
  //   if (name === 'phoneNumber') {
  //     console.log(e.target.value.length)
  //     //validate field is not empty and length is 12
  //     errorMessage = (e.target.value.length < 14) ? `Please enter valid 10 digit phone number.` : '';
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   }

  //   if (name === 'referralPropertyState') {
  //     errorMessage = (e.target.value.toLowerCase() == '') ? `Please select property state.` : '';
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   }

  //   //validate firstname and last name
  //   if (name === 'firstName' || name === 'lastName') {
  //     if(name == "firstName"){
  //       // remove attributes from the property state
  //       document.querySelector('.nf-select').removeAttribute('tabindex');
  //     }
  //     // change to camel case
  //     const camelCaseName = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  //     setFormData((prevData) => ({ ...prevData, [name]: camelCaseName }));
  //     errorMessage = util.validateName(camelCaseName) ? '' : `Please enter a valid ${name}.`;
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   }
  //   const allFieldPresent = Object.values(formData).every((value) => value !== '');
  //   const allfieldValid = Object.values(errors).every((value) => value === '');
  //   if (allFieldPresent && allfieldValid) {
  //     handleOTPGeneration();
  //   }

  // }

  const handleValidation = (e) => {
    const { name, value } = e.target;
    let errorMessage = {};
  
    setErrors((prevErrors) => {
      let updatedErrors = { ...prevErrors };
  
      if (name === 'emailId') {
        updatedErrors.email = util.validateEmail(value) ? '' : 'Please enter a valid email address.';
      }
  
      if (name === 'phoneNumber') {
        updatedErrors.phoneNumber = value.length < 14 ? 'Please enter a valid 10-digit phone number.' : '';
      }
  
      if (name === 'referralPropertyState') {
        updatedErrors.referralPropertyState = value.toLowerCase() === '' ? 'Please select a property state.' : '';
      }
  
      if (name === 'firstName' || name === 'lastName') {
        document.querySelector('.nf-select').removeAttribute('tabindex');
        //to be refactored==Ravi
        if(document.querySelectorAll('.nf-select').length>1){
          document.querySelectorAll('.nf-select').forEach(element => {
            element.removeAttribute('tabindex');
        });
        
        }
  
        const camelCaseName = value.charAt(0).toUpperCase() + value.slice(1);
        setFormData((prevData) => ({ ...prevData, [name]: camelCaseName }));
  
        updatedErrors[name] = util.validateName(camelCaseName) ? '' : `Please enter a valid ${name}.`;
      }
  
      // Check if all fields are present and valid using updated state
      const allFieldPresent = Object.values({ ...formData, [name]: value }).every((val) => val !== '');
      const allFieldValid = Object.values(updatedErrors).every((val) => val === '');
  
      if (allFieldPresent && allFieldValid) {
        handleOTPGeneration();
      }
  
      return updatedErrors;
    });
  };
  

  const handleOTPGeneration = () => {
    setRespErrorMsg('');
    const { phoneNumber, emailId } = formData;

    const emailValidation = util.validateEmail(emailId);
    const phoneNumberValidation = phoneNumber.replace(/\D/g, '').length === 10;
    // Check if either phone number or email is present and if they have changed
    const shouldGetOTP = (phoneNumber && emailId) && (emailValidation && phoneNumberValidation) && (
      phoneNumber !== prevFormData?.phoneNumber ||
      emailId !== prevFormData?.emailId
    );

    if (shouldGetOTP) {
      setAllFieldValid(false);
      saveUserDetailsWp();
      const phoneNumberValue = phoneNumber.replace(/\D/g, "");
      // apiService.post(`/rest/leadSource/send_otp?recipientPhoneNumber=${phoneNumberValue}&emailId=${emailId}`, {}).then((response) => {
        axios.post(`${API_URL}wp-json/newfi/v1/submitEmailPhone?recipientPhoneNumber=${phoneNumberValue}&emailId=${emailId}`, {}).then(response => {
        const result = response.data.resultObject;
        const error = response.data.error;
        if (!error) {
          if (result.otpStatus.toLowerCase() == 'delivered' || result.otpStatus.toLowerCase() == "success") {
            setOtpKey(prevKey => prevKey + 1);
            setAllFieldValid(true);
            // Store current formData for comparison in the next effect run
            setPrevFormData(formData);
          } else if (result.otpStatus === "FAILED" && result.message === "Duplicate Lead") {
            redirectTo404();
          } else {
            redirectTo404();
          }
        } else {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage === "limit exceeded") {
            redirectTo404();
          } else if (errorMessage === "invalid request" || error.message.includes("not a valid phone number")) {
            setRespErrorMsg("Invalid phone number.");
          } else if (error.code == "400" || errorMessage === "invalid email") {
            setRespErrorMsg("Invalid email. Please enter valid email.");
          }
        }
      });

    }
  }

  const handleGaConnectorUpdate = (data) => {
    //update GA connector data
    setUser((prevUser) => ({
      ...prevUser,
      ...data
    }))
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    let btnText = e.target.name;
    // Here you would typically make an API call to save the data
    let LoanAppFormVO = new Object();
    let loan = new Object();
    let loanType = new Object();

    LoanAppFormVO.user = {
      "firstName": formData.firstName,
      "lastName": formData.lastName,
      "emailId": formData.emailId,
      "phoneNumber": formData.phoneNumber.replace(/\D/g, ""),
      "userRole": {
        "roleDescription": "Borrower"
      }
    };
    LoanAppFormVO.user.gaConnector = user.gaConnector;
    LoanAppFormVO.referralPropertyState = formData.referralPropertyState;
    LoanAppFormVO.leadSource = "Newfi Website";
    const { leadPurpose, loanManagerEmail } = constants.getLoanType(btnText);
    loanType.loanTypeCd = leadPurpose;
    if (loanManagerEmail)
      LoanAppFormVO.loanManagerEmail = loanManagerEmail;
    LoanAppFormVO.loanType = loanType;
    LoanAppFormVO.user.isGAConnector = true;;
    LoanAppFormVO.otp = otpFieldVal;
    LoanAppFormVO.isLeadFromNewfiWebsite = true;
    // LoanAppFormVO.loan = loan;
    let reqData = new FormData();
    reqData.append('newfiWebsiteLeadDetails', JSON.stringify(LoanAppFormVO));
    //api call create lead : rest/leadSource/newfiWebsiteLeadDetails
    // apiService.post('/rest/leadSource/newfiWebsiteLeadDetails', reqData, { headers: { 'Content-Type': 'multipart/form-data', }, cache: 'no-cache' }).then((response) => {
      axios.post(`${API_URL}wp-json/newfi/v1/saveLeadDetails?client_id=${uid}`, reqData).then((response) => {
      let data = response.data;
      let loanTypeCd = LoanAppFormVO.loanType.loanTypeCd;
      if (data.resultObject !== null && data.resultObject !== "Failure") {
        let envUrl = data.resultObject.url.replace(/(loancenter\/)/, '');

        if ((data.resultObject.duplicateAccount != undefined && data.resultObject.duplicateLead != undefined) && (data.resultObject.duplicateAccount == true || data.resultObject.duplicateLead == true)) {
          window.setTimeout(() => {
            if (data.resultObject.duplicateAccount == true && (data.resultObject.duplicateLead != undefined && data.resultObject.duplicateLead == true)) {
              window.location.href = data.resultObject.url;
            } else if ((data.resultObject.duplicateLead != undefined && data.resultObject.duplicateLead == true) && data.resultObject.duplicateAccount == false) {
              if (LoanAppFormVO.loanType.loanTypeCd == 'PUR' || LoanAppFormVO.loanType.loanTypeCd == 'PURSTEPUP') {
                window.location.href = envUrl + "preapproval/#/" + data.resultObject.crmId + "/";
              } else if (LoanAppFormVO.loanType.loanTypeCd == 'REFNSAM') {
                window.location.href = envUrl + "equitychoice/#/" + data.resultObject.crmId + "/";
              } else {
                window.location.href = envUrl + "savings/#/" + data.resultObject.crmId + "/";
              }
            }

          }, 5000);
        } else if (data.resultObject.otpStatus == 'FAILED' && data.resultObject.message == 'Duplicate Lead') {
          let redirectUrl;
          if (
            loanTypeCd === "PUR" ||
            loanTypeCd === "PURSTEPUP"
          ) {
            redirectUrl = `${envUrl}preapproval/#/${data.resultObject.crmId}/`;
          } else if (loanTypeCd === "REFNSAM") {
            redirectUrl = `${envUrl}equitychoice/#/${data.resultObject.crmId}/`;
          } else {
            redirectUrl = `${envUrl}savings/#/${data.resultObject.crmId}/`;
          }
          window.location.href = redirectUrl;
        } else {
          if (LoanAppFormVO.loanType.loanTypeCd == 'PUR' || LoanAppFormVO.loanType.loanTypeCd == 'PURSTEPUP') {
            window.location.href = envUrl + "preapproval/#/" + data.resultObject.crmId + "/";
          } else if (LoanAppFormVO.loanType.loanTypeCd == 'REFNSAM') {
            window.location.href = envUrl + "equitychoice/#/" + data.resultObject.crmId + "/";
          } else {
            window.location.href = envUrl + "savings/#/" + data.resultObject.crmId + "/";
          }

        }
      } else {

        if (data.error.message === "Invalid OTP, Please Enter Valid OTP") {
          setRespErrorMsg("Please enter valid verification code");
        } else if (["400", "Invalid email"].includes(data.error.code) || data.error.message.toLowerCase() === "invalid email") {
          setRespErrorMsg("Invalid email. Please enter valid email.");
          redirectTo404();
        } else if (data.error.message === "OTP Expired") {
          setRespErrorMsg("Verification code expired. Please generate again");
          // disable  submit buttons
          setIsSubmitBtnEnabled(false);
          //enable OTP Section
          setIsOtpEnabled(true);
        } else if (data.error.message.toLowerCase() === "limit exceeded") {
          redirectTo404();
        } else {
          setRespErrorMsg(data.error.message);
          //enable OTP Section
          setIsOtpEnabled(true);

          // disable  submit buttons
          setIsSubmitBtnEnabled(false);
        }
      }
    }).catch(error => { console.error('There was an error!', error); });

  };

  const saveUserDetailsWp = () => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let Qparams = Object.fromEntries(urlSearchParams.entries());
    let LoanAppFormVO = new Object();
    LoanAppFormVO.user = {
      "firstName": formData.firstName,
      "lastName": formData.lastName,
      "emailId": formData.emailId,
      "phoneNumber": formData.phoneNumber.replace(/\D/g, ""),
      "URL": window.location.href,
      "UTM": Qparams,
      "lat": lat,
      "lon": lon,
    };
    let reqData = new FormData();
    reqData.append('newfiWebsiteLeadDetails', JSON.stringify(LoanAppFormVO));
    axios.post(`${API_URL}wp-json/newfi/v1/submitData`, reqData)
    .then(response => {
      setUid(response.data);
      // console.log('success');
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  const redirectTo404 = () => {
    setTimeout(() => {
      window.location.href = `${window.location.origin}/404`;
    }, 1000);
  };

  return (
    <div>
      <OverlayLoader />
      <form className="get-started-form">
        <div className="flex gap15 sm-flexW sm-gap0">
          <div className="form-group w-50 sm-w-100">
            <input
              className="nf-control"
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onBlur={handleValidation}
              onChange={handleChange}
              required
            />
            {errors.firstName && <p className='nf-error-text'>{errors.firstName}</p>}

          </div>
          <div className="form-group w-50 sm-w-100">
            <input
              className="nf-control"
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onBlur={handleValidation}
              onChange={handleChange}
              required
            />
            {errors.lastName && <p className='nf-error-text'>{errors.lastName}</p>}
          </div>
        </div>

        <div className="flex gap15 sm-flexW sm-gap0">
          <div className="form-group w-50 sm-w-100 dropdown-container">
            {/* <Dropdown tabIndex={3} name="referralPropertyState" options={stateList} onChange={handleChange} onBlur={handleValidation}
              onFocus={handleDropdownFocus}  // Add onFocus
              /> */}
            <select
              onChange={handleChange}
              onBlur={handleValidation}
              name="referralPropertyState"
              className="nf-select nf-form-select"
              data-exclude-select2="true"
            >
              <option value="" disabled selected>Property State</option>
              {stateList.map((state) => (
                <option key={state.id} value={state.stateName}>
                  {state.stateName}
                </option>
              ))}
            </select>
            {errors.referralPropertyState && <p className='nf-error-text'>{errors.referralPropertyState}</p>}
          </div>
          <div className="form-group w-50 sm-w-100">
            <input
              className="nf-control"
              type="email"
              id="emailId"
              name="emailId"
              placeholder="Email"
              value={formData.email}
              onBlur={handleValidation}
              onChange={handleChange}
              required
            />
            {errors.email && <p className='nf-error-text'>{errors.email}</p>}
          </div>
        </div>
        <div className="form-group w-50 sm-w-100">
          <input
            className="nf-control"
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Primary Phone"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleValidation}
            maxLength="14"
            required
          />
          {errors.phoneNumber && <p className='nf-error-text' >{errors.phoneNumber}</p>}
        </div>

        {
          (allfieldValid || isOtpEnabled) && <OtpForm key={otpKey} isExpired={isOtpEnabled} cId={uid} formData={formData} onValueChange={enableSubmitButton} />
        }
        {respErrorMsg && <div className="nf-error-common">{respErrorMsg}</div>}
        <div className="flex alignC gap15 mT40 justifyC">
          {(formType == 'savings') && <button className="nf-btn nf-btn-priamry w-200I" type="submit" id='refinance' name='refinance' disabled={!(allfieldValid && isSubmitBtnsEnabled)} onClick={handleSubmit}>Submit</button>}
          {(formType == 'purchase') && <button className="nf-btn nf-btn-priamry w-200I" type="submit" id='purchase' name='purchase' disabled={!(allfieldValid && isSubmitBtnsEnabled)} onClick={handleSubmit}>Submit</button>}
        </div>
       
        <GaConnector onUpdate={handleGaConnectorUpdate} />
        <Consent/>
      </form>

    </div>

  );
}
export default RefinaceForm;
