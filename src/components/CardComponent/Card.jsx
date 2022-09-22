import React from "react";
import "./Card.css";
import defCard from "../../assets/default-card.png";
import Player from "../PlayerComponent/Player.jsx";

const Card = ({ cardImage }) => {
  return (
    <div className="card-container">
      <img className="card-game-image" src={cardImage} alt="default-card" />
    </div>
  );
};

Card.defaultProps = {
  cardImage: defCard,
};

export default Card;
