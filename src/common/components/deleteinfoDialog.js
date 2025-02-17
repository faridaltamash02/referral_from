import React from 'react';

const DeleteInfoDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // If the modal is not open, render nothing

  return (
    <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>Alert</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <p>User details will be permanently deleted 15 days after the date of creation.</p>
      </div>
      <div className="modal-footer">
        <button className="ok-btn" onClick={onClose}>Ok</button>
      </div>
    </div>
  </div>
  );
};

export default DeleteInfoDialog;
