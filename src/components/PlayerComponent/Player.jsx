import React, { useEffect, useState } from "react";
import "./Player.css";
import Card from "../CardComponent/Card.jsx";
import { getCardsFromPileCall } from "../../utils/api-calls.js";

const Player = ({
  playerId,
  playerName,
  shuffled,
  refreshGame,
  onClick,
  isDisabled,
}) => {
  const [playerCards, setPlayerCards] = useState([]);

  const getCardsFromPile = async (pileName) => {
    await getCardsFromPileCall(pileName)
      .then((res) => {
        setPlayerCards(res);
      })
      .catch((e) => {
        console.log(`${playerName} does not have any cards`);
        console.log(e.response.data);
      });
  };

  useEffect(() => {
    getCardsFromPile(playerName);
  }, [shuffled, refreshGame]);

  return (
    <div className="player-container">
      <div className="left-side">
        <h1>Player {playerId}</h1>
      </div>
      <div className="right-side">
        {playerCards.length !== 0 ? (
          playerCards.map((card, i) => (
            <Card
              key={i}
              cardImage={playerCards[i].image}
              onClick={() => onClick(playerCards[i].code, isDisabled)}
              disabled={isDisabled}
            />
          ))
        ) : (
          <h3>You don't have any cards.</h3>
        )}
      </div>
    </div>
  );
};
Player.defaultProps = {
  playerId: 0,
  playerName: "player0",
};

export default Player;
