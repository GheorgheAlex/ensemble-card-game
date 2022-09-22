import React, { useEffect, useState } from "react";
import "./MainPage.css";
import Player from "../../components/PlayerComponent/Player.jsx";
import PlayField from "../../components/PlayFieldComponent/PlayField.jsx";
import {
  getNewDeckCall,
  shuffleCardDeckCall,
  getCardsFromDeckCall,
  putCardsIntoPlayer1PileCall,
  putCardsIntoPlayer2PileCall,
  putCardsIntoPlayedCardsPileCall,
} from "../../utils/api-calls.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const MainPage = () => {
  const [newGame, setNewGame] = useState(false);

  const getNewDeck = async () => {
    await getNewDeckCall()
      .then((res) => {
        localStorage.setItem("deckId", res.deck_id);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const putCardsIntoPlayer1Pile = async (arrayOfCards) => {
    await putCardsIntoPlayer1PileCall(arrayOfCards)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        toast.error("Error when adding cards to Player1 deck!");
        console.log(e.response);
      });
  };

  const putCardsIntoPlayer2Pile = async (arrayOfCards) => {
    await putCardsIntoPlayer2PileCall(arrayOfCards)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        toast.error("Error when adding cards to Player2 deck!");
        console.log(e.response);
      });
  };

  const putCardsIntoPlayedCardsPile = async (arrayOfCards) => {
    await putCardsIntoPlayedCardsPileCall(arrayOfCards)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        toast.error("Error when adding cards to Played Cards deck!");
        console.log(e.response);
      });
  };

  const handleShuffleClick = async (e) => {
    e.preventDefault();
    await shuffleCardDeckCall()
      .then((res) => {
        console.log(res.data);
        setNewGame(false);
      })
      .catch((e) => {
        toast.error("Cannot shuffle deck!");
      });
    toast.info("Card deck is shuffled!");
  };

  const handleNewGameClick = async (e) => {
    e.preventDefault();

    await getCardsFromDeckCall(5)
      .then((cards) => {
        console.log(cards);
        putCardsIntoPlayer1Pile(cards);
      })
      .catch((e) => {
        console.log(e.response.data);
        toast.error("Cannot draw from deck!");
      });

    await getCardsFromDeckCall(5)
      .then((cards) => {
        putCardsIntoPlayer2Pile(cards);
      })
      .catch((e) => {
        console.log(e.response.data);
        toast.error("Cannot draw from deck!");
      });

    await getCardsFromDeckCall(1)
      .then((cards) => {
        putCardsIntoPlayedCardsPile(cards);
        toast.info("A new game is started!");
      })
      .catch((e) => {
        console.log(e.response.data);
        toast.error("Cannot draw from deck!");
      });

    setNewGame(true);
  };

  useEffect(() => {
    const localStorageItem = localStorage.getItem("deckId");
    if (!localStorageItem) {
      getNewDeck();
    }
  }, []);

  return (
    <div className="main-page">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="header">
        <h1>Card game</h1>
      </div>
      <div className="content">
        <div className="content-left-side">
          <button onClick={(e) => handleShuffleClick(e)}>Shuffle</button>
          <button onClick={(e) => handleNewGameClick(e)}>New game</button>
        </div>
        <div className="content-right-side">
          <Player playerId={2} playerName="player2" newGame={newGame} />
          <PlayField />
          <Player playerId={1} playerName="player1" newGame={newGame} />
        </div>
      </div>
      <div className="footer">
        <h3>
          Made by Alex Gheorghe as a coding challenge for Ensemble Software. All
          rights not reserved :P.
        </h3>
      </div>
    </div>
  );
};

export default MainPage;
