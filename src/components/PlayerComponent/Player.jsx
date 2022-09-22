import React from "react";
import "./Player.css";
import Card from "../CardComponent/Card.jsx";

const Player = ({ playerId }) => {
  return (
    <div className="player-container">
      <div className="left-side">
        <h1>Player {playerId}</h1>
      </div>
      <div className="right-side">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};
Player.defaultProps = {
  playerId: 0,
};

export default Player;
