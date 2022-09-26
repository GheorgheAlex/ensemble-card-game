import React from "react";
import "./Card.css";
import defCard from "../../assets/default-card.png";
import cardBack from "../../assets/card-back.png";

const Card = ({ cardImage, cardWidth, onClick, disabled, alwaysVisible }) => {
  return (
    <div className="card-container">
      <img
        className="card-game-image"
        style={{ width: `${cardWidth}px` }}
        src={
          disabled === false || alwaysVisible === true ? cardImage : cardBack
        }
        alt="default-card"
        onClick={onClick}
      />
    </div>
  );
};

Card.defaultProps = {
  cardImage: defCard,
  cardWidth: 100,
  alwaysVisible: false,
};

export default Card;
