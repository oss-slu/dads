// InfoCard.js
import React from 'react';
import './InfoCard.css'; 

const InfoCard = ({ title, value, description }) => {
  return (
    <div className="info-card">
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <p className="desc">{description}</p>
    </div>
  );
};

export default InfoCard;
