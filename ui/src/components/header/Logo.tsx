
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center rounded-md bg-primary p-1.5">
        <span className="text-white font-bold text-xl">C</span>
      </div>
      <span className="font-display font-semibold text-xl text-primary">CuraChain</span>
    </Link>
  );
};

export default Logo;
