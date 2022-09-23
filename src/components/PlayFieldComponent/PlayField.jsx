import React, { useEffect, useState } from "react";
import "./PlayField.css";
import cardBack from "../../assets/card-back.png";
import loading from "../../assets/loading.gif";
import { getCardsFromPileCall } from "../../utils/api-calls.js";
import Player from "../PlayerComponent/Player.jsx";
import Card from "../CardComponent/Card.jsx";

const PlayField = ({ name, shuffled, refreshGame, newGame }) => {
  const [discardedCards, setDiscardedCards] = useState([]);
  const cards = [];

  const getCardsFromPile = async (playedCardsPile) => {
    await getCardsFromPileCall(playedCardsPile)
      .then((res) => {
        setDiscardedCards(res[res.length - 1]);
        cards.push(res[res.length - 1]);
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
        {discardedCards ? (
          <Card
            cardWidth={150}
            alwaysVisible={true}
            cardImage={discardedCards.image ? discardedCards.image : loading}
          />
        ) : (
          <h3>Played cards</h3>
        )}
      </div>
    </div>
  );
};

export default PlayField;
