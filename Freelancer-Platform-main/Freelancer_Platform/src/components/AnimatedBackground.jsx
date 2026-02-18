import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
      {/* Animated Gradient Background */}
      <div className="animated-bg" />

      {/* Floating Particles */}
      <div className="particles">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Geometric Shapes */}
      <div className="geometric-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
      </div>
    </>
  );
};

export default AnimatedBackground;
