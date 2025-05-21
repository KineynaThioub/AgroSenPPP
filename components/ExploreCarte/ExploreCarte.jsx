"use client";

import React from "react";
import "./ExploreCarte.css";


const ExploreCarte = ({ category, setCategory }) => {


  const culture_list = [
    {
      id: 1,
      culture_image: "/assets/culture/Fruits.jpg",
      culture_name: "Fruits"
    },
    {
      id: 2,
      culture_image: "/assets/culture/Legumes.jpg",
      culture_name: "Legumes"
    },
    {
      id: 3,
      culture_image: "/assets/culture/Céréales.jpg",
      culture_name: "Céréales"
    },
    {
      id: 4,
      culture_image: "/assets/culture/Légumineuses.jpg",
      culture_name: "Légumineuses"
    },
    {
      id: 5,
      culture_image: "/assets/culture/Graines oléagineuses.jpg",
      culture_name: "Graines oléagineuses"
    },
    {
      id: 6,
      culture_image: "/assets/culture/Plantes à racines et tubercules.jpg",
      culture_name: "Plantes à racines et tubercules"
    },
    {
      id: 7, 
      culture_image: "/assets/culture/Plantes aromatiques et médicinales.jpg",
      culture_name: "Plantes aromatiques/ médicinales"
    },
    {
      id: 8,
      culture_image: "/assets/culture/Cultures mar.jpg",
      culture_name: "Cultures maraîchères "
    }
  ]; 


 

  return (
    <div className="explore-carte" id="explore-carte">
      <h1>My Country, My Diversity</h1>
      <p className="explore-carte-text">
        Choose from a diverse array of cultural regions that showcase the
        unique traditions, cuisine, and heritage. Our mission is to promote
        understanding and appreciation of our country's rich diversity.
      </p>
      
      <div className="explore-carte-list">
  {culture_list.map((item, index) => (
    <div
      key={index}
      className="explore-carte-list-item"
      onClick={() =>
        setCategory(prev =>
          prev === item.culture_name ? "All" : item.culture_name
        )
      }
    >
    <div
      className={`image-container ${
        category === item.culture_name ? "active" : ""
      }`}
    >
        <img src={item.culture_image} alt={item.culture_name} />
      </div>
      <p>{item.culture_name}</p>
    </div>
  ))}
</div>


        <br></br>
      <hr />
    </div>
  );
};

export default ExploreCarte;