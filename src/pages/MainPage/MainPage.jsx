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
  const [cardsAreShuffled, setCardsAreShuffled] = useState(true);
  const [isRefreshed, setIsRefreshed] = useState(false);

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
        return res;
      })

      .catch((e) => {
        toast.error("Error when adding cards to Player1 deck!");
        console.log(e.response);
      });
  };

  const putCardsIntoPlayer2Pile = async (arrayOfCards) => {
    await putCardsIntoPlayer2PileCall(arrayOfCards)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Error when adding cards to Player2 deck!");
        console.log(e.response);
      });
  };

  const putCardsIntoPlayedCardsPile = async (arrayOfCards) => {
    await putCardsIntoPlayedCardsPileCall(arrayOfCards)
      .then((res) => {
        return res;
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
        setNewGame(false);
        toast.info("Card deck is shuffled!");
      })
      .catch((e) => {
        toast.error("Cannot shuffle deck!");
      });
    setCardsAreShuffled(!cardsAreShuffled);
  };

  const handleNewGameClick = async (e) => {
    e.preventDefault();

    await getCardsFromDeckCall(5)
      .then((cards) => {
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
    setCardsAreShuffled(false);
    setIsRefreshed(!isRefreshed);
  };

  useEffect(() => {
    const localStorageItem = localStorage.getItem("deckId");
    if (!localStorageItem) {
      getNewDeck();
      toast.success("You have a new deck to play!");
    } else {
      shuffleCardDeckCall();
      toast.info(
        "Cards are shuffled. Press new game to start a game or shuffle if you want the deck to be shuffled again!"
      );
    }
  }, []);

  return (
    <div className="main-page">
      <ToastContainer
        position="top-center"
        autoClose={2500}
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
          <button
            onClick={(e) => {
              if (newGame === false) {
                handleNewGameClick(e);
              } else {
                toast.error("Shuffle the cards first and then press new game!");
              }
            }}
          >
            New game
          </button>
        </div>
        <div className="content-right-side">
          <Player
            playerId={2}
            playerName="player2"
            newGame={newGame}
            shuffled={cardsAreShuffled}
            refreshGame={isRefreshed}
          />
          <PlayField
            name="playedCards"
            shuffled={cardsAreShuffled}
            refreshGame={isRefreshed}
            newGame={newGame}
          />
          <Player
            playerId={1}
            playerName="player1"
            shuffled={cardsAreShuffled}
            refreshGame={isRefreshed}
          />
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
