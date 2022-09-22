import React, { useEffect, useState } from "react";
import "./Player.css";
import Card from "../CardComponent/Card.jsx";
import { getPlayerCardsCall } from "../../utils/api-calls.js";

const Player = ({ playerId, playerName, newGame }) => {
  const [playerCards, setPlayerCards] = useState([]);
  const getPlayerCards = async () => {
    await getPlayerCardsCall(playerName)
      .then((res) => {
        if (playerName === "player1") {
          setPlayerCards(res.player1.cards);
        } else if (playerName === "player2") {
          setPlayerCards(res.player2.cards);
        }
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };
  useEffect(() => {
    getPlayerCards();
    console.log(playerCards);
  }, [newGame]);

  console.log(playerCards);
  return (
    <div className="player-container">
      <div className="left-side">
        <h1>Player {playerId}</h1>
      </div>
      <div className="right-side">
        {playerCards.length !== 0 ? (
          playerCards.map((card, i) => (
            <Card key={i} cardImage={playerCards[i].image} />
          ))
        ) : (
          <h3>You don't have any cards</h3>
        )}
      </div>
    </div>
  );
};
Player.defaultProps = {
  playerId: 0,
  newGame: false,
  playerName: "player0",
};

export default Player;
