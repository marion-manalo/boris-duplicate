import React, { useState } from 'react';
import './ICard.css';

interface InfoIconProps {
  text: string; 
}

// implement blue infocard on report page
function InfoIcon({ text }: InfoIconProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="info-icon-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="info-icon">i</div>
      {hovered && <div className="info-tooltip">{text}</div>}
    </div>
  );
}

export default InfoIcon;
