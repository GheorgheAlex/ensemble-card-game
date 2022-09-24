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
  putCardsIntoPlayedCardsPileArrayCall,
  getCardsFromPileCall,
  drawFromPlayer1PileCall,
  drawFromPlayer2PileCall,
  putCardIntoPlayedCardsPileCall,
  getLastCardFromPlayedCardsPileCall,
} from "../../utils/api-calls.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainPage = () => {
  const [newGame, setNewGame] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [cardsAreShuffled, setCardsAreShuffled] = useState(true);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [playedCard, setPlayedCard] = useState("");
  const [numberOfErrors, setNumberOfErrors] = useState(0);
  const [showPickCardButton, setShowPickCardButton] = useState(false);

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

  const putCardIntoPlayedCardsPile = async (card) => {
    await putCardIntoPlayedCardsPileCall(card)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Failed adding card to played cards!");
        console.log(e.response.data);
      });
  };

  const putCardsIntoPlayedCardsArrayPile = async (arrayOfCards) => {
    await putCardsIntoPlayedCardsPileArrayCall(arrayOfCards)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Error when adding cards to Played Cards deck!");
        console.log(e.response);
      });
  };

  const drawFromPlayer1Pile = async () => {
    await drawFromPlayer1PileCall()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Failed to take card from Player 1 pile");
      });
  };

  const drawFromPlayer2Pile = async () => {
    await drawFromPlayer2PileCall()
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Failed to take card from Player 2 pile");
      });
  };

  const handleShuffleClick = async (e) => {
    e.preventDefault();
    await shuffleCardDeckCall()
      .then((res) => {
        setNewGame(false);
        setActivePlayer(null);
        // setPlayedCard("");
        setNumberOfErrors(0);
        setShowPickCardButton(false);
        toast.info("Card deck is shuffled!");
      })
      .catch((e) => {
        toast.error("Cannot shuffle deck!");
        console.log(e);
      });
    setCardsAreShuffled(!cardsAreShuffled);
  };

  const handleNewGameClick = async (e) => {
    e.preventDefault();
    toast.info("Preparing cards...");

    try {
      await getCardsFromDeckCall(5).then((cards) =>
        putCardsIntoPlayer1Pile(cards)
      );
      await getCardsFromDeckCall(5).then((cards) =>
        putCardsIntoPlayer2Pile(cards)
      );

      await getCardsFromDeckCall(1).then((cards) =>
        putCardsIntoPlayedCardsArrayPile(cards)
      );
    } catch (e) {
      console.log("Error", e);
      console.log(e.response.data);
      toast.error("Cannot draw from deck!");
    }

    toast.success("Cards are distributed. Have fun!");
    setNewGame(true);
    setCardsAreShuffled(false);
    setIsRefreshed(!isRefreshed);
    await extractPlayedCardData();
    changeActivePlayer();
  };

  const changeActivePlayer = async () => {
    await extractPlayedCardData();
    const active = activePlayer;
    setActivePlayer(!activePlayer);
    if (!active === true) {
      toast.info("Is Player 1 turn");
    } else toast.info("Is Player 2 turn");
  };

  const extractPlayedCardData = async () => {
    await getLastCardFromPlayedCardsPileCall().then((res) => {
      setPlayedCard(res.code);
    });
  };

  const handleCardClick = async (i, disabled) => {
    const splittedUsedCard = Array.from(i);
    const usedCardValue = splittedUsedCard[0];
    const usedCardSuit = splittedUsedCard[1];

    const splittedPlayedCard = Array.from(playedCard);
    const playedCardValue = splittedPlayedCard[0];
    const playedCardSuit = splittedPlayedCard[1];
    if (disabled === true || showPickCardButton === true) {
      console.log("Player is disabled");
    } else {
      console.log("Card clicked".i);

      await checkCardRules(
        i,
        usedCardValue,
        usedCardSuit,
        playedCardValue,
        playedCardSuit
      );
    }
  };

  const checkCardRules = async (
    usedCard,
    usedCardValue,
    usedCardSuit,
    playedCardValue,
    playedCardSuit
  ) => {
    if (usedCardValue === playedCardValue || usedCardSuit === playedCardSuit) {
      if (activePlayer === true) {
        try {
          await drawFromPlayer1Pile(usedCard).then(() =>
            putCardIntoPlayedCardsPile(usedCard)
          );
          changeActivePlayer();
        } catch (e) {
          console.log("Error", e);
          console.log(e.response.data);
        }
      } else if (activePlayer === false) {
        try {
          await drawFromPlayer2Pile(usedCard).then(() =>
            putCardIntoPlayedCardsPile(usedCard)
          );
          changeActivePlayer();
        } catch (e) {
          console.log("Error", e);
          console.log(e.response.data);
        }
      }
      toast.success("Good move");
      setIsRefreshed(!isRefreshed);
    } else {
      toast.error("You cannot do this");
      setNumberOfErrors(numberOfErrors + 1);
    }

    if (numberOfErrors === 1) {
      toast.info("You must now pick a card");
      setShowPickCardButton(true);
    }
  };

  const handlePickCardButton = async (e) => {
    e.preventDefault();
    if (activePlayer === true) {
      try {
        await getCardsFromDeckCall(1).then((cards) =>
          putCardsIntoPlayer1Pile(cards)
        );
        changeActivePlayer();
        toast.info("Picked a card.");
        setShowPickCardButton(false);
        setNumberOfErrors(0);
        setIsRefreshed(!isRefreshed);
      } catch (e) {
        console.log("Error", e);
        console.log(e.response.data);
      }
    } else if (activePlayer === false) {
      try {
        await getCardsFromDeckCall(1).then((cards) =>
          putCardsIntoPlayer2Pile(cards)
        );
        changeActivePlayer();
        toast.info("Picked a card.");
        setShowPickCardButton(false);
        setNumberOfErrors(0);
        setIsRefreshed(!isRefreshed);
      } catch (e) {
        console.log("Error", e);
        console.log(e.response.data);
      }
    }
  };

  useEffect(() => {
    const localStorageItem = localStorage.getItem("deckId");
    if (!localStorageItem) {
      getNewDeck();
      toast.success(
        "You have a new deck to play! You just need to shuffle it and start a game!"
      );
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
        autoClose={1500}
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
          {showPickCardButton ? (
            <button onClick={(e) => handlePickCardButton(e)}>
              Pick a card
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="content-right-side">
          <Player
            playerId={2}
            playerName="player2"
            newGame={newGame}
            shuffled={cardsAreShuffled}
            refreshGame={isRefreshed}
            onClick={handleCardClick}
            isDisabled={activePlayer}
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
            onClick={handleCardClick}
            isDisabled={!activePlayer}
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
