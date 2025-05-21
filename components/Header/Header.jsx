"use client";

import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  // État pour gérer les images du carrousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Tableau d'images - utilisez vos chemins d'images
  const images = [
    "/assets/header0.jpg",
    "/assets/header1.jpg",
    "/assets/header2.jpg",
    "/assets/header3.jpg",
    "/assets/header4.jpg",
    "/assets/header6.jpg",
    "/assets/header7.jpg"
  ];
  
  // Effet pour changer automatiquement l'image active
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change d'image toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="header-container">
      <div className="header">
        {/* Carrousel d'images en arrière-plan */}
        <div className="image-carousel">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`carousel-image ${index === currentImageIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        
        {/* Overlay pour assurer la lisibilité du texte */}
        <div className="overlay"></div>
        
        {/* Contenu aligné à gauche comme dans le design Tomato */}
        <div className="header-content">
          <h1>Senegal <br/>Baay Dundu</h1>
          <p>Choose from a diverse menu featuring a delectable array of dishes created with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
          <button className="view-menu-btn">View Menu</button>
        </div>
        
        {/* Indicateurs de navigation */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span 
              key={index} 
              className={`indicator ${index === currentImageIndex ? "active" : ""}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;