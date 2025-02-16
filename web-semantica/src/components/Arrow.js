import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from '@mui/material/IconButton';

const Arrow = ({ direction, onClick }) => {
  const arrowStyles = {
    left: { transform: 'rotate(0deg)' },
    right: { transform: 'rotate(180deg)' },
    up: { transform: 'rotate(90deg)' },
    down: { transform: 'rotate(270deg)' },
  };

  return (
    <IconButton disableRipple={true} aria-label="delete" size="large" style={{ ...arrowStyles[direction], color: "white"}} onClick={onClick}>
        <ArrowBackIosNewIcon style={{ fontSize: "50px" }} />
    </IconButton>
  );
};

export default Arrow;