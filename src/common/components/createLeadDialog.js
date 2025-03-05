  import React, { useState } from 'react';
  import apiService from '../services/apiService';
  const CreateLeadDialog = ({ isOpen, onClose, userDetail }) => {
    const [loanType, setLoanType] = useState();
   
    
    if (!isOpen) return null; // If the modal is not open, render nothing
  
    const createLead = () => {
      let reqObj = {
        firstName: userDetail.first_name,
        lastName: userDetail.last_name,
        phoneNumber: userDetail.phone_number,
        email_id: userDetail.email,
        propertyState: userDetail.referralPropertyState,
        loanPurpose: loanType,
        createdBy: sessionStorage.getItem("wp_logged_in_user")
      }
      https://uat.newfi.com/loancenter/rest/crm/createDashboardLead
 
      apiService.post('rest/crm/createDashboardLead', JSON.stringify(reqObj), { headers: { 'Content-Type': 'application/json', }, cache: 'no-cache' }).then((data) => {
        if (data.resultObject !== null && data.resultObject !== "Failure") {
          let envUrl = data.resultObject.url.replace(/(loancenter\/)/, '');
          if ((data.resultObject.duplicateAccount != undefined && data.resultObject.duplicateLead != undefined) && (data.resultObject.duplicateAccount == true || data.resultObject.duplicateLead == true)) {
            window.setTimeout(() => {
              if (data.resultObject.duplicateAccount == true && (data.resultObject.duplicateLead != undefined && data.resultObject.duplicateLead == true)) {
                window.location.href = data.resultObject.url;
              } else if ((data.resultObject.duplicateLead != undefined && data.resultObject.duplicateLead == true) && data.resultObject.duplicateAccount == false) {
                if (loanType == 'PUR') {
                  window.location.href = envUrl + "preapproval/#/" + data.resultObject.crmId + "/";
                } else if (loanType == 'REFNSAM') {
                  window.location.href = envUrl + "equitychoice/#/" + data.resultObject.crmId + "/";
                } else {
                  window.location.href = envUrl + "savings/#/" + data.resultObject.crmId + "/";
                }
              }
            }, 5000);
          } else if (data.resultObject.otpStatus == 'FAILED' && data.resultObject.message == 'Duplicate Lead') {
            let redirectUrl;
            if (loanType === "PUR") {
              redirectUrl = `${envUrl}preapproval/#/${data.resultObject.crmId}/`;
            } else if (loanType === "REFNSAM") {
              redirectUrl = `${envUrl}equitychoice/#/${data.resultObject.crmId}/`;
            } else {
              redirectUrl = `${envUrl}savings/#/${data.resultObject.crmId}/`;
            }
            window.location.href = redirectUrl;
          } else {
            if (loanType == 'PUR') {
              window.location.href = envUrl + "preapproval/#/" + data.resultObject.crmId + "/";
            } else if (loanType == 'REFNSAM') {
              window.location.href = envUrl + "equitychoice/#/" + data.resultObject.crmId + "/";
            } else {
              window.location.href = envUrl + "savings/#/" + data.resultObject.crmId + "/";
            }
  
          }
        }
      })
    }
    return (
      <div className="modal-overlay createlead">
        <div className="modal">
          <div className="modal-header">
          <h2>What goal best describes your purpose for the financing?</h2>
          {/* {userInfo && (
            <div className="user-info">
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
            </div>
          )} */}
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {/* <h2 className='body-head'>What goal best describes your purpose for the financing?</h2> */}
            <div className="flexC flexW gap15 mT20">
              <div className="nf-checklist-item">
                <input
                  className="nf-checklist-checkbox dN"
                  type="radio"
                  id="PUR"
                  name="financeGoal"
                  onChange={(event) => setLoanType(event.target.value)}
                  value="PUR"
                />
                <label className="nf-checklist-label" htmlFor="PUR">
                  Purchase
                </label>
              </div>
              <div className="nf-checklist-item">
                <input
                  type="radio"
                  className="nf-checklist-checkbox dN"
                  id="REF"
                  name="financeGoal"
                  onChange={(event) => setLoanType(event.target.value)}
                  value="REF"
                />
                <label className="nf-checklist-label" htmlFor="REF">
                  Refinance
                </label>
              </div>
              <div className="nf-checklist-item">
                <input
                  type="radio"
                  className="nf-checklist-checkbox dN"
                  id="equity"
                  name="financeGoal"
                  onChange={(event) => setLoanType(event.target.value)}
                  value="REFNSAM"
                />
                <label className="nf-checklist-label" htmlFor="equity">
                  Home Equity
                </label>
              </div>
            </div>
          </div>
        
          <div className="modal-footer">
            <button className="ok-btn round" disabled={!loanType} onClick={createLead}>Submit</button>
          </div>
        </div>
      </div>
    );
  };

  export default CreateLeadDialog;