import React from "react";
import "./PlayField.css";
import cardBack from "../../assets/card-back.png";
import Player from "../PlayerComponent/Player.jsx";

const PlayField = () => {
  return (
    <div className="play-field-container">
      <div className="play-field-deck">
        {/*<h3>Deck</h3>*/}
        <img src={cardBack} alt="card-back" />
      </div>
      <div className="play-field-pile">
        <h3>Pile of cards</h3>
      </div>
    </div>
  );
};

export default PlayField;
