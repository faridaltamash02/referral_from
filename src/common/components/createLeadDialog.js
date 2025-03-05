  import React from 'react';
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890"
  };
  const CreateLeadDialog = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // If the modal is not open, render nothing

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
                  value="true"
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
                />
                <label className="nf-checklist-label" htmlFor="equity">
                  Home Equity (Second Mortgage)
                </label>
              </div>
            </div>
          </div>
        
          {/* <div className="modal-footer">
            <button className="ok-btn round " onClick={onClose}>Create</button>
          </div> */}
        </div>
      </div>
    );
  };

  export default CreateLeadDialog;