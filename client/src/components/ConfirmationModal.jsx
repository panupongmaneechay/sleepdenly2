// client/src/components/ConfirmationModal.jsx

import React from 'react';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onDecline, yesText, noText }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content confirmation-modal">
        <p>{message}</p>
        <div className="button-group">
          <button className="confirm-button" onClick={onConfirm}>{yesText || 'Yes'}</button>
          <button className="decline-button" onClick={onDecline}>{noText || 'No'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;