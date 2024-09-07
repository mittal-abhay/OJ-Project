import React from 'react';
import './loader.css';

const Loader = ({ size = '50px', color = '#5AE4A8', thickness = '4px' }) => {
  const style = {
    width: size,
    height: size,
    border: `${thickness} solid ${color}`,
    borderTop: `${thickness} solid transparent`,
  };

  return (
    <div className="loader-container">
      <div className="loader" style={style}></div>
    </div>
  );
};

export default Loader;
