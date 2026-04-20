import React from 'react';
import './Loading.css';

export default function Loading({ text = "Memuat data..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
      <h3 className="loading-text">{text}</h3>
    </div>
  );
}