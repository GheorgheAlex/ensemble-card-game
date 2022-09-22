import React from "react";
import "./PlayField.css";

const PlayField = () => {
  return (
    <div className="play-field-container">
      <div className="play-field-deck">
        <h3>Deck</h3>
      </div>
      <div className="play-field-pile">
        <h3>Pile of cards</h3>
      </div>
    </div>
  );
};

export default PlayField;
