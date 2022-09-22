import React from "react";
import "./Card.css";
import defCard from "../../assets/default-card.png";

const Card = () => {
  return (
    <div className="card-container">
      <img className="card-game-image" src={defCard} alt="default-card" />
    </div>
  );
};

export default Card;
