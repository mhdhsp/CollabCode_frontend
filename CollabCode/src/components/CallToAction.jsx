// src/components/CallToAction.js
import React from 'react';

const CallToAction = ({ primaryText = 'Get Started', secondaryText = 'Contact', onPrimary, onSecondary }) => {
  return (
    <div className="text-center my-4">
      <button className="btn btn-primary me-2" onClick={onPrimary}>
        {primaryText}
      </button>
      <button className="btn btn-outline-secondary" onClick={onSecondary}>
        {secondaryText}
      </button>
    </div>
  );
};

export default CallToAction;