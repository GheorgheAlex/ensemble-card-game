import React, { useEffect, useState } from "react";
import "./PlayField.css";
import cardBack from "../../assets/card-back.png";
import { getCardsFromPileCall } from "../../utils/api-calls.js";
import Player from "../PlayerComponent/Player.jsx";
import Card from "../CardComponent/Card.jsx";

const PlayField = ({ name, shuffled, refreshGame, newGame }) => {
  const [discardedCards, setDiscardedCards] = useState([]);

  const getCardsFromPile = async (playedCardsPile) => {
    await getCardsFromPileCall(playedCardsPile)
      .then((res) => {
        setDiscardedCards(res);
      })
      .catch((e) => {
        console.log("Played cards pile does not have any cards");
        console.log(e.response.data);
      });
  };

  useEffect(() => {
    setDiscardedCards([]);

    getCardsFromPile(name);
  }, [newGame, refreshGame]);

  return (
    <div className="play-field-container">
      <div className="play-field-deck">
        <img src={cardBack} alt="card-back" />
      </div>
      <div className="play-field-pile">
        {discardedCards.length !== 0 ? (
          discardedCards.map((discardedCard, i) => (
            <Card key={i} cardWidth={150} cardImage={discardedCards[i].image} />
          ))
        ) : (
          <h3>Played cards</h3>
        )}
      </div>
    </div>
  );
};

export default PlayField;
