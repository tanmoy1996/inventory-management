import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/assets/animaions/loader.json';

const LoaderAnimation: React.FC = () => {
  return <Lottie animationData={animationData} style={{ width: 300, height: 300 }} />;
};

export default LoaderAnimation;