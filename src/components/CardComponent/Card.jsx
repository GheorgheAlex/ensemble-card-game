import React from "react";
import "./Card.css";
import defCard from "../../assets/default-card.png";
import Player from "../PlayerComponent/Player.jsx";

const Card = ({ cardImage, cardWidth }) => {
  return (
    <div className="card-container">
      <img
        className="card-game-image"
        style={{ width: `${cardWidth}px` }}
        src={cardImage}
        alt="default-card"
      />
    </div>
  );
};

Card.defaultProps = {
  cardImage: defCard,
  cardWidth: 100,
};

export default Card;
