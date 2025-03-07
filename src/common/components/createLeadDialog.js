  import React, { useState } from 'react';
  import apiService from '../services/apiService';
  import axios from 'axios';
  const CreateLeadDialog = ({ isOpen, onClose, userDetail, onLeadCreated }) => {
    const [loanType, setLoanType] = useState();
    const [message, setMessage] = useState('');
   
    let dynamicURL = window.location.origin.includes('staging') ? 'https://staging.newfi.com/' : 'https://newfi.com/';
    const API_URL = dynamicURL || 'https://staging.newfi.com/';
    if (!isOpen) return null; // If the modal is not open, render nothing
  
    const createLead = () => {
      let createdBy = sessionStorage.getItem("wp_logged_in_user");

      if (!createdBy) {
        const nameElement = document.querySelectorAll('.display-name')[0]; // Get the first element
        createdBy = nameElement ? nameElement.textContent.trim() : ''; // Update the existing variable
      }

      let reqObj = {
        firstName: userDetail.first_name,
        lastName: userDetail.last_name,
        phoneNumber: userDetail.phone_number,
        email: userDetail.email_id,
        propertyState: userDetail.referralPropertyState,
        loanPurpose: loanType,
        createdBy: createdBy
      }

      apiService.post('rest/crm/createDashboardLead', JSON.stringify(reqObj), { headers: { 'Content-Type': 'application/json', }, cache: 'no-cache' }).then((response) => {
        if (response.data.resultObject !== null && response.data.resultObject !== "Failure") {
          let envUrl = API_URL;
          let crmId = response.data.resultObject;

          if (crmId === "ERROR") {
            if (response.data.error) {
              if (response.data.error.message.includes('duplicate') && crmId === "ERROR") {
                // Show message in UI duplicate lead and close after 5 seconds
                console.log('Duplicate lead');
                setMessage('Duplicate lead');
                setTimeout(() => {
                  setMessage('');

                  onClose();

                }, 5000); // Close modal after 5 seconds
              }
            } else {
              // Update UI to show error message
              setMessage('Error creating lead');
              console.log('Error creating lead');
            }
            setTimeout(() => {
              setMessage('');

              onClose();

            }, 5000);

          } else {
            axios.post(`${API_URL}wp-json/newfi/v1/updateLeadInfo?phoneNumber=${userDetail.phone_number}&email=${userDetail.email_id}&crmId=${crmId}`, {}).then(response => {
              console.log(response);
            }).catch(error => {
              console.log(error);
            });
            if (response.status === 200) {
              setMessage('Lead created successfully with CRM ID: ' + crmId);
              console.log('Lead created successfully');
              onLeadCreated(userDetail.phone_number, userDetail.email_id, crmId);
              setTimeout(() => {
                setMessage('');

                onClose();

              }, 5000);
            } else {
              setMessage('Lead creation failed');
              setTimeout(() => {
                setMessage('');

                onClose();
              }, 5000);
            }

          }

        }
      })
    }
    return (
      <div className="modal-overlay createlead">
        <div className="modal">
          <div className="modal-header">
          {message ? (
            <h2>Info</h2>
          ) : (
          <h2>What goal best describes your purpose for the financing?</h2>
          )}
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
            {message ? (
            <div className="message">{message}</div>
          ) : (
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
          )}
          </div>
        
          {!message && ( <div className="modal-footer">
            <button className="ok-btn round" disabled={!loanType} onClick={createLead}>Submit</button>
          </div>
          )}
        </div>
      </div>
    );
  };

  export default CreateLeadDialog;