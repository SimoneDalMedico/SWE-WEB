import React from 'react'

import classes from './Video.module.css';

const Video = React.forwardRef((ref) => {
  return <video autoPlay playsInline ref={ref} />;
});

export default Video;
