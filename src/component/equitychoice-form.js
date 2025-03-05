import React, { useState, useEffect } from 'react';
import OtpForm from './otp-form';
import CommonConstants from '../common/constants';
import Util from '../common/util';
import GaConnector from '../common/components/ga-connector';
import apiService from '../common/services/apiService';
import Consent from './consent';
import axios from 'axios';
import OverlayLoader from '../common/components/loader';


function EquityChoiceForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailId: '',
    housePrice: '',
    referralPropertyState: '',
    // userRole: {
    //   "roleDescription": "Borrower"
    // }
  });
  const [isSubmitBtnsEnabled, setIsSubmitBtnEnabled] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' })
  const [allfieldValid, setAllFieldValid] = useState(false);
  const [respErrorMsg, setRespErrorMsg] = useState('');
  const [prevFormData, setPrevFormData] = useState(null);

  const util = new Util();
  const [user, setUser] = useState({});

  const [stateList, setStateList] = useState([]);
  const [lat, setlat] = useState('');
  const [lon, setlon] = useState('');

  const constants = new CommonConstants();
  useEffect(() => {
    //to fetch approved states states    
    setStateList(constants.getEquityChoiceState().resultObject);
    util.getCordinates().then(resp => {
      setlat(resp.lat);
      setlon(resp.lon)
    }).catch(e => console.log(e))
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      setFormData({ ...formData, [name]: util.formatPhoneNumber(value) });
    } else if (name === 'housePrice') {
      if(e.target.value.length){
        setFormData({ ...formData, [name]: util.formatCurrency(value) });
      }
    } else if (name === 'referralPropertyState') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
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

  //   if (name === 'housePrice') {
      
  //     //validate field is not empty
  //     errorMessage = (e.target.value.length < 1) ? `Please enter estimate home value.` : '';
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
      
  //   }

  //   if (name === 'referralPropertyState') {
  //     errorMessage = (e.target.value.toLowerCase() == 'property state') ? `Please select property state.` : '';
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

      if (name === 'housePrice') {
        //validate field is not empty
        updatedErrors.housePrice = value.trim() === '' ? 'Please enter an estimated home value.' : '';
        
      }
  
      if (name === 'firstName' || name === 'lastName') {
        if (name === 'firstName') {
          document.querySelector('.nf-select').removeAttribute('tabindex');
          if(document.querySelectorAll('.nf-select').length>1){
            document.querySelectorAll('.nf-select').forEach(element => {
              element.removeAttribute('tabindex');
          });
          
          }
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
        // ${baseurl}/send_otp?recipientPhoneNumber=${phoneNumberValue}&emailId=${email}$
        apiService.post(`/rest/leadSource/send_otp?recipientPhoneNumber=${phoneNumberValue}&emailId=${emailId}&loanType=REFNSAM`, {}).then((response) => {
          const result = response.data.resultObject;
          const error = response.data.error;
          if (!error) {
            if (result.toLowerCase() == 'delivered' || result.toLowerCase() == "success") {
              //setOtpKey(prevKey => prevKey + 1);
              setAllFieldValid(true);
              setIsSubmitBtnEnabled(true);
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
    //let btnText = e.target.name;
    // Here you would typically make an API call to save the data
    //console.log('Form data submitted:', formData);
    let LoanAppFormVO = new Object();
    // let loan = new Object();
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
    LoanAppFormVO.housePrice = formData.housePrice.replace(/[^\w\s]/gi,"");
    let id = window.location.href;
    let final = id.split('/')[3];
    // let url = id.replace(/\//g,"");
    let leadUrl = (final.toLowerCase() === 'equitychoice-transunion' || final.toLowerCase() === 'equitychoiceheloc') ? 'equitychoice-transunion' : id.split("/")[4];
    let leadPurpose;
    const leadUrlMapping = {
        'home': 'DM Equifax',
        'equity': 'DM Delux',
        'smallbusinessfunds': 'Newfi Website',
        'equitychoice-transunion': 'Transunion DM'
    };

    if (leadPurpose === "REFNSAM" && ['home', 'equity', 'equitychoice-transunion', 'smallbusinessfunds'].includes(leadUrl)) {
        LoanAppFormVO.leadSource = leadUrlMapping[leadUrl] || 'DM Equifax';
    } else if (final === 'bankrate-x-newfi') {
        LoanAppFormVO.leadSource = "Bankrate";
    } else {
        LoanAppFormVO.leadSource = "Newfi Website";
    }
    loanType.loanTypeCd = "REFNSAM";
    //loan.loanType = loanType;
    LoanAppFormVO.user.isGAConnector = true;;
    LoanAppFormVO.isLeadFromNewfiWebsite = true;
    LoanAppFormVO.loanType = loanType;
    let reqData = new FormData();
    reqData.append('newfiWebsiteLeadDetails', JSON.stringify(LoanAppFormVO));
    //api call create lead : rest/leadSource/newfiWebsiteLeadDetails
    apiService.post('/rest/leadSource/newfiWebsiteLeadDetails', reqData, { headers: { 'Content-Type': 'multipart/form-data', }, cache: 'no-cache' }).then((response) => {
      let data = response.data;
      if (data.resultObject !== null && data.resultObject !== "Failure") {
        let envUrl = data.resultObject.url.replace(/(loancenter\/)/, '');

        if (data.resultObject.duplicateAccount || data.resultObject.duplicateLead) {
          setTimeout(() => {
            const crmId = data.resultObject.crmId;

            if (data.resultObject.duplicateAccount && data.resultObject.duplicateLead) {
              window.location.href = data.resultObject.url;
            } else if (data.resultObject.duplicateLead) {
              window.location.href = `${envUrl}equitychoice/#/${crmId}/`;
            }
          }, 5000);
        } else if (data.resultObject.otpStatus === 'FAILED' && data.resultObject.message === 'Duplicate Lead') {
          const crmId = data.resultObject.crmId;
          let redirectUrl;
          redirectUrl = `${envUrl}equitychoice/#/${crmId}/`;
          window.location.href = redirectUrl;
        } else {
          const crmId = data.resultObject.crmId;
          window.location.href = `${envUrl}equitychoice/#/${crmId}/`;
        }
      } else {

        if (["400", "Invalid email"].includes(data.error.code) || data.error.message.toLowerCase() === "invalid email") {
          setRespErrorMsg("Invalid email. Please enter valid email.");
          redirectTo404();
        } else if (data.error.message.toLowerCase() === "limit exceeded") {
          redirectTo404();
        } else {
          setRespErrorMsg(data.error.message);
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
      "housePrice": formData.housePrice.replace(/[^\w\s]/gi,"")
    };
    let reqData = new FormData();
    reqData.append('newfiWebsiteLeadDetails', JSON.stringify(LoanAppFormVO));
    axios.post('https://staging.newfi.com/wp-json/newfi/v1/submitData', reqData)
    .then(response => {
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
        <div className="flex gap15 sm-gap0 sm-flexW">
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
        
        <div className="flex gap15 sm-gap0 sm-flexW">
          <div className="form-group w-50 sm-w-100 dropdown-container">
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
              value={formData.emailId}
              onBlur={handleValidation}
              onChange={handleChange}
              required
            />
            {errors.email && <p className='nf-error-text'>{errors.email}</p>}
          </div>
        </div>
        <div className='flex gap15 sm-gap0 sm-flexW'>
          <div className="form-group w-50 sm-w-100">
            <input
              className="nf-control"
              type="text"
              id="housePrice"
              name="housePrice"
              placeholder="Estimate Home Value"
              maxLength={10}
              value={formData.housePrice}
              onBlur={handleValidation}
              onChange={handleChange}
              required
            />
            {errors.housePrice && <p className='nf-error-text'>{errors.housePrice}</p>}
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
        </div>
        

        {respErrorMsg && <div className="nf-error-common">{respErrorMsg}</div>}
        <div className="flex alignC gap15 mT40 justifyC">
          <button className="nf-btn nf-btn-priamry w-200I" type="submit" id='equityChoice' name='equityChoice' disabled={!(allfieldValid && isSubmitBtnsEnabled)} onClick={handleSubmit}>Submit</button>
        </div>
        <GaConnector onUpdate={handleGaConnectorUpdate} />
        <Consent/>
      </form>

    </div>

  );
}

export default EquityChoiceForm;

