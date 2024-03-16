import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // External CSS file for styling

const Carousel = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const duplicatedImages = useRef([...images]); // Initialize with original images

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % duplicatedImages.current.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      if (containerRef.current && currentIndex === duplicatedImages.current.length - 1) {
        containerRef.current.style.transition = 'none';
        setCurrentIndex(0);
        setTimeout(() => {
          containerRef.current.style.transition = '';
          duplicatedImages.current = [...duplicatedImages.current, ...images]; // Append original images
        });
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [currentIndex, images]);

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div
          ref={containerRef}
          className="slides-container"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.5s ease'
          }}
        >
          {duplicatedImages.current.map((image, index) => (
            <div key={index} className="slide">
              <img src={image} alt={`slide-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
