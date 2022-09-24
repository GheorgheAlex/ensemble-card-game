import axios from "axios";
import card from "../components/CardComponent/Card.jsx";
import player from "../components/PlayerComponent/Player.jsx";

const deck_id = localStorage.getItem("deckId");
const player1Pile = "player1";
const player2Pile = "player2";
const playedCardsPile = "playedCards";

export const getNewDeckCall = async () => {
  const res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
  return res.data;
};

export const shuffleCardDeckCall = async () => {
  const res = axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`
  );
  return res;
};

export const getCardsFromDeckCall = async (numberOfCards) => {
  const res = await axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numberOfCards}`
  );
  return res.data.cards;
};

export const putCardsIntoPlayer1PileCall = async (arrayOfCards) => {
  const drawedCardsArray = [];
  for (let i = 0; i < arrayOfCards.length; i++) {
    drawedCardsArray.push(arrayOfCards[i].code);
  }
  const cardsInStringFormat = drawedCardsArray
    .map((card) => `${card}`)
    .join(`,`);
  const res = await axios.put(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player1Pile}/add/?cards=${cardsInStringFormat}`
  );
  return res;
};

export const putCardsIntoPlayer2PileCall = async (arrayOfCards) => {
  const drawedCardsArray = [];
  for (let i = 0; i < arrayOfCards.length; i++) {
    drawedCardsArray.push(arrayOfCards[i].code);
  }
  const cardsInStringFormat = drawedCardsArray
    .map((card) => `${card}`)
    .join(`,`);
  const res = await axios.put(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player2Pile}/add/?cards=${cardsInStringFormat}`
  );
  return res;
};

export const putCardsIntoPlayedCardsPileArrayCall = async (arrayOfCards) => {
  const drawedCardsArray = [];
  for (let i = 0; i < arrayOfCards.length; i++) {
    drawedCardsArray.push(arrayOfCards[i].code);
  }
  const cardsInStringFormat = drawedCardsArray
    .map((card) => `${card}`)
    .join(`,`);
  const res = await axios.put(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${playedCardsPile}/add/?cards=${cardsInStringFormat}`
  );
  return res;
};

export const getCardsFromPileCall = async (pileName) => {
  const res = await axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileName}/list/`
  );

  const piles = res.data.piles;

  if (
    piles &&
    Object.keys(piles).length === 0 &&
    Object.getPrototypeOf(piles) === Object.prototype
  ) {
    return [];
  } else {
    if (pileName === player1Pile && piles.player1) {
      return res.data.piles.player1.cards;
    }

    if (pileName === player2Pile && piles.player2) {
      return res.data.piles.player2.cards;
    }

    if (pileName === playedCardsPile && piles.playedCards) {
      return res.data.piles.playedCards.cards;
    }
  }
};

export const getLastCardFromPlayedCardsPileCall = async () => {
  const res = await axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${playedCardsPile}/list/`
  );
  return res.data.piles.playedCards.cards.at(-1);
};

export const drawFromPlayer1PileCall = async (card) => {
  return axios.get(
    `https://www.deckofcardsapi.com/api/deck/${deck_id}/pile/${player1Pile}/draw/?cards=${card}`
  );
};

export const drawFromPlayer2PileCall = async (card) => {
  return axios.get(
    `https://www.deckofcardsapi.com/api/deck/${deck_id}/pile/${player2Pile}/draw/?cards=${card}`
  );
};

export const putCardIntoPlayedCardsPileCall = async (card) => {
  return axios.get(
    `https://www.deckofcardsapi.com/api/deck/${deck_id}/pile/${playedCardsPile}/add/?cards=${card}`
  );
};

export const getNumberOfCardsPlayer1Call = async () => {
  const res = await axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player1Pile}/list/`
  );
  return res.data.piles.player1.cards.length;
};

export const getNumberOfCardsPlayer2Call = async () => {
  const res = await axios.get(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player2Pile}/list/`
  );
  return res.data.piles.player2.cards.length;
};
