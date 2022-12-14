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
  getNumberOfCardsPlayer1Call,
  getNumberOfCardsPlayer2Call,
  getPlayer1CardsValuesCall,
  getPlayer2CardsValuesCall,
} from "../../utils/api-calls.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainPage = () => {
  const [newGame, setNewGame] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [numberOfCardsPlayer1, setNumberOfCardsPlayer1] = useState(-1);
  const [numberOfCardsPlayer2, setNumberOfCardsPlayer2] = useState(-1);
  const [player1CardsValues, setPlayer1CardsValues] = useState([]);
  const [player2CardsValues, setPlayer2CardsValues] = useState([]);
  const [playedCard, setPlayedCard] = useState("");
  const [numberOfErrors, setNumberOfErrors] = useState(0);
  const [showPickCardButton, setShowPickCardButton] = useState(false);
  const [haveToDraw, setHaveToDraw] = useState(false);
  const [cardsNumberToDraw, setCardsNumberToDraw] = useState(0);
  const [haveToWait, setHaveToWait] = useState(false);
  const [roundsToWait, setRoundsToWait] = useState(0);
  const [gameIsEnded, setGameIsEnded] = useState(false);
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

  const putCardIntoPlayedCardsPile = async (card) => {
    await putCardIntoPlayedCardsPileCall(card)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        toast.error("Failed adding card to played cards pile!");
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

  const getNumberOfCardsPlayer1 = async () => {
    await getNumberOfCardsPlayer1Call().then((res) => {
      setNumberOfCardsPlayer1(res);
    });
  };

  const getNumberOfCardsPlayer2 = async () => {
    await getNumberOfCardsPlayer2Call().then((res) => {
      setNumberOfCardsPlayer2(res);
    });
  };

  const getPlayer1CardValues = async () => {
    await getPlayer1CardsValuesCall()
      .then((res) => {
        setPlayer1CardsValues(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPlayer2CardValues = async () => {
    await getPlayer2CardsValuesCall()
      .then((res) => {
        setPlayer2CardsValues(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleShuffleClick = async (e) => {
    e.preventDefault();
    await shuffleCardDeckCall()
      .then((res) => {
        setNewGame(false);
        setActivePlayer(null);
        setPlayedCard("");
        setNumberOfErrors(0);
        setShowPickCardButton(false);
        setGameIsEnded(false);
        setHaveToDraw(false);
        setCardsNumberToDraw(0);
        setNumberOfCardsPlayer1(-1);
        setNumberOfCardsPlayer2(-1);
        setPlayer1CardsValues([]);
        setPlayer2CardsValues([]);
        setHaveToWait(false);
        setRoundsToWait(0);
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
      toast.success("Cards are distributed. Have fun!");
    } catch (e) {
      console.log(e.response.data);
      toast.error("Cannot draw from deck!");
    }

    setNewGame(true);
    setCardsAreShuffled(false);
    setIsRefreshed(!isRefreshed);
    setGameIsEnded(false);
    setHaveToDraw(false);
    setCardsNumberToDraw(0);
    setHaveToWait(false);
    setRoundsToWait(0);
    setNumberOfCardsPlayer1(-1);
    setNumberOfCardsPlayer2(-1);
    await extractPlayedCardData();
    getNumberOfCardsPlayer1();
    getNumberOfCardsPlayer2();
    getPlayer1CardValues();
    getPlayer2CardValues();
    changeActivePlayer();
  };

  const updatePlayerStates = async () => {
    await extractPlayedCardData();
    await getNumberOfCardsPlayer1();
    await getNumberOfCardsPlayer2();
    await getPlayer1CardValues();
    await getPlayer2CardValues();
  };

  const changeActivePlayer = async () => {
    await extractPlayedCardData();
    await getNumberOfCardsPlayer1();
    await getNumberOfCardsPlayer2();
    await getPlayer1CardValues();
    await getPlayer2CardValues();

    setNumberOfErrors(0);
    checkIfGameIsEnded();
    const active = activePlayer;
    setActivePlayer(!activePlayer);

    if (cardsNumberToDraw === 0) setHaveToDraw(false);

    if (!active === true) {
      toast.info("Is Player 1 turn");
    } else toast.info("Is Player 2 turn");
  };

  const checkIfGameIsEnded = async () => {
    if (numberOfCardsPlayer1 === 0) {
      toast.success("Player1 WON!");
      setGameIsEnded(true);
    } else if (numberOfCardsPlayer2 === 0) {
      toast.success("Player2 WON!");
      setGameIsEnded(true);
    }
  };

  const extractPlayedCardData = async () => {
    await getLastCardFromPlayedCardsPileCall().then((res) => {
      setPlayedCard(res.code);
    });
  };

  const handleCardClick = async (i, disabled) => {
    await checkIfGameIsEnded();
    const splittedUsedCard = Array.from(i);
    const usedCardValue = splittedUsedCard[0];
    const usedCardSuit = splittedUsedCard[1];

    const splittedPlayedCard = Array.from(playedCard);
    const playedCardValue = splittedPlayedCard[0];
    const playedCardSuit = splittedPlayedCard[1];
    if (disabled === true || showPickCardButton === true) {
      toast.info("Pick a card");
    } else {
      if (haveToDraw === false && haveToWait === false) {
        await checkCardRules(
          i,
          usedCardValue,
          usedCardSuit,
          playedCardValue,
          playedCardSuit,
          false
        );
      } else if (haveToDraw === true && haveToWait === false) {
        if (activePlayer === true) {
          if (playedCardValue === "2" && usedCardValue === "2") {
            await checkCardRules(
              i,
              usedCardValue,
              usedCardSuit,
              playedCardValue,
              playedCardSuit,
              false
            );
          } else if (playedCardValue === "2" && usedCardValue !== "2") {
            toast.error("You cannot play that card. You must play a 2");
          }
          if (playedCardValue === "3" && usedCardValue === "3") {
            await checkCardRules(
              i,
              usedCardValue,
              usedCardSuit,
              playedCardValue,
              playedCardSuit,
              false
            );
          } else if (playedCardValue === "3" && usedCardValue !== "3") {
            toast.error("You cannot play that card. You must play a 3");
          }
        } else if (activePlayer === false) {
          if (playedCardValue === "2" && usedCardValue === "2") {
            await checkCardRules(
              i,
              usedCardValue,
              usedCardSuit,
              playedCardValue,
              playedCardSuit,
              false
            );
          } else if (playedCardValue === "2" && usedCardValue !== "2") {
            toast.error("You cannot play that card. You must play a 2");
          }
          if (playedCardValue === "3" && usedCardValue === "3") {
            await checkCardRules(
              i,
              usedCardValue,
              usedCardSuit,
              playedCardValue,
              playedCardSuit,
              false
            );
          } else if (playedCardValue === "3" && usedCardValue !== "3") {
            toast.error("You cannot play that card. You must play a 3");
          }
        }
      } else if (haveToDraw === false && haveToWait === true) {
        if (activePlayer === true) {
          if (playedCardValue === "A" && usedCardValue === "A") {
            for (let j = roundsToWait; j === 0; j--) {
              await checkCardRules(
                i,
                usedCardValue,
                usedCardSuit,
                playedCardValue,
                playedCardSuit,
                true
              );
            }
            await changeActivePlayer();
          } else if (playedCardValue === "A" && usedCardValue !== "A") {
            toast.error("You cannot play that card. You must play an Ace");
          }
          if (playedCardValue === "4" && usedCardValue === "4") {
            for (let j = roundsToWait; j === 0; j--) {
              await checkCardRules(
                i,
                usedCardValue,
                usedCardSuit,
                playedCardValue,
                playedCardSuit,
                true
              );
            }
            await changeActivePlayer();
          } else if (playedCardValue === "4" && usedCardValue !== "4") {
            toast.error("You cannot play that card. You must play a 4");
          }
        } else if (activePlayer === false) {
          if (playedCardValue === "A" && usedCardValue === "A") {
            for (let j = roundsToWait; j === 0; j--) {
              await checkCardRules(
                i,
                usedCardValue,
                usedCardSuit,
                playedCardValue,
                playedCardSuit,
                true
              );
            }
            await changeActivePlayer();
          } else if (playedCardValue === "A" && usedCardValue !== "A") {
            toast.error("You cannot play that card. You must play an Ace");
          }
          if (playedCardValue === "4" && usedCardValue === "4") {
            for (let j = roundsToWait; j === 0; j--) {
              await checkCardRules(
                i,
                usedCardValue,
                usedCardSuit,
                playedCardValue,
                playedCardSuit,
                true
              );
            }
            await changeActivePlayer();
          } else if (playedCardValue === "4" && usedCardValue !== "4") {
            toast.error("You cannot play that card. You must play a 4");
          }
        }
      }
    }
  };

  const checkCardRules = async (
    usedCard,
    usedCardValue,
    usedCardSuit,
    playedCardValue,
    playedCardSuit,
    wait
  ) => {
    if (usedCardValue === playedCardValue || usedCardSuit === playedCardSuit) {
      switch (usedCardValue) {
        case "2":
          if (activePlayer === true) {
            const filteredPlayer2Cards = player2CardsValues.filter(
              (element) => element === "2"
            );
            if (filteredPlayer2Cards.length === 0) {
              if (cardsNumberToDraw === 0) {
                try {
                  await getCardsFromDeckCall(2).then((cards) =>
                    putCardsIntoPlayer2Pile(cards)
                  );
                  await drawFromPlayer1Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                } catch (e) {
                  console.log(e);
                }
                if (!wait) await changeActivePlayer();
              } else {
                try {
                  await getCardsFromDeckCall(cardsNumberToDraw).then((cards) =>
                    putCardsIntoPlayer2Pile(cards)
                  );
                  setCardsNumberToDraw(0);
                  await drawFromPlayer1Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                } catch (e) {
                  console.log(e);
                }
                if (!wait) await changeActivePlayer();
              }
            } else if (filteredPlayer2Cards.length !== 0) {
              setCardsNumberToDraw(cardsNumberToDraw + 2);
              setHaveToDraw(true);
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) await changeActivePlayer();
            }
          } else if (activePlayer === false) {
            const filteredPlayer1Cards = player1CardsValues.filter(
              (element) => element === "2"
            );
            if (filteredPlayer1Cards.length === 0) {
              if (cardsNumberToDraw === 0) {
                try {
                  await getCardsFromDeckCall(2).then((cards) =>
                    putCardsIntoPlayer1Pile(cards)
                  );
                  await drawFromPlayer2Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              } else {
                try {
                  await getCardsFromDeckCall(cardsNumberToDraw).then((cards) =>
                    putCardsIntoPlayer1Pile(cards)
                  );
                  setCardsNumberToDraw(0);
                  await drawFromPlayer2Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              }
            } else if (filteredPlayer1Cards.length !== 0) {
              setCardsNumberToDraw(cardsNumberToDraw + 2);
              setHaveToDraw(true);
              try {
                await drawFromPlayer2Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) await changeActivePlayer();
            }
          }
          break;
        case "3":
          if (activePlayer === true) {
            const filteredPlayer2Cards = player2CardsValues.filter(
              (element) => element === "3"
            );
            if (filteredPlayer2Cards.length === 0) {
              if (cardsNumberToDraw === 0) {
                try {
                  await getCardsFromDeckCall(3).then((cards) =>
                    putCardsIntoPlayer2Pile(cards)
                  );
                  await drawFromPlayer1Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              } else {
                try {
                  await getCardsFromDeckCall(cardsNumberToDraw).then((cards) =>
                    putCardsIntoPlayer2Pile(cards)
                  );
                  setCardsNumberToDraw(0);
                  await drawFromPlayer1Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              }
            } else if (filteredPlayer2Cards.length !== 0) {
              setCardsNumberToDraw(cardsNumberToDraw + 3);
              setHaveToDraw(true);
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) await changeActivePlayer();
            }
          } else if (activePlayer === false) {
            const filteredPlayer1Cards = player1CardsValues.filter(
              (element) => element === "3"
            );
            if (filteredPlayer1Cards.length === 0) {
              if (cardsNumberToDraw === 0) {
                try {
                  await getCardsFromDeckCall(3).then((cards) =>
                    putCardsIntoPlayer1Pile(cards)
                  );
                  await drawFromPlayer2Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              } else {
                try {
                  await getCardsFromDeckCall(cardsNumberToDraw).then((cards) =>
                    putCardsIntoPlayer1Pile(cards)
                  );
                  setCardsNumberToDraw(0);
                  await drawFromPlayer2Pile(usedCard).then(() =>
                    putCardIntoPlayedCardsPile(usedCard)
                  );
                  if (!wait) await changeActivePlayer();
                } catch (e) {
                  console.log(e);
                }
              }
            } else if (filteredPlayer1Cards.length !== 0) {
              setCardsNumberToDraw(cardsNumberToDraw + 3);
              setHaveToDraw(true);
              try {
                await drawFromPlayer2Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) await changeActivePlayer();
            }
          }
          break;
        case "A":
          if (activePlayer === true) {
            const filteredPlayer2Cards = player2CardsValues.filter(
              (element) => element === "A"
            );
            if (filteredPlayer2Cards.length === 0) {
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
                setIsRefreshed(!isRefreshed);
                await updatePlayerStates();
              } catch (e) {
                console.log(e);
              }
            } else if (filteredPlayer2Cards.length !== 0) {
              setHaveToWait(true);
              setRoundsToWait(roundsToWait + 1);
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) {
                await changeActivePlayer();
              } else {
                await updatePlayerStates();
              }
            }
          } else if (activePlayer === false) {
            const filteredPlayer1Cards = player1CardsValues.filter(
              (element) => element === "A"
            );
            if (filteredPlayer1Cards.length === 0) {
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
                setIsRefreshed(!isRefreshed);
                await updatePlayerStates();
              } catch (e) {
                console.log(e);
              }
            } else if (filteredPlayer1Cards.length !== 0) {
              setHaveToWait(true);
              setRoundsToWait(roundsToWait + 1);
              try {
                await drawFromPlayer2Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) {
                await changeActivePlayer();
              } else {
                await updatePlayerStates();
              }
            }
          }
          break;
        case "4":
          if (activePlayer === true) {
            const filteredPlayer2Cards = player2CardsValues.filter(
              (element) => element === "4"
            );
            if (filteredPlayer2Cards.length === 0) {
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
                setIsRefreshed(!isRefreshed);
                await updatePlayerStates();
              } catch (e) {
                console.log(e);
              }
            } else if (filteredPlayer2Cards.length !== 0) {
              setHaveToWait(true);
              setRoundsToWait(roundsToWait + 1);
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) {
                await changeActivePlayer();
              } else {
                await updatePlayerStates();
              }
            }
          } else if (activePlayer === false) {
            const filteredPlayer1Cards = player1CardsValues.filter(
              (element) => element === "4"
            );
            if (filteredPlayer1Cards.length === 0) {
              try {
                await drawFromPlayer1Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
                setIsRefreshed(!isRefreshed);
                await updatePlayerStates();
              } catch (e) {
                console.log(e);
              }
            } else if (filteredPlayer1Cards.length !== 0) {
              setHaveToWait(true);
              setRoundsToWait(roundsToWait + 1);
              try {
                await drawFromPlayer2Pile(usedCard).then(() =>
                  putCardIntoPlayedCardsPile(usedCard)
                );
              } catch (e) {
                console.log(e);
              }
              if (!wait) {
                await changeActivePlayer();
              } else {
                await updatePlayerStates();
              }
            }
          }
          break;
        default:
          if (activePlayer === true) {
            try {
              await drawFromPlayer1Pile(usedCard).then(() =>
                putCardIntoPlayedCardsPile(usedCard)
              );
              if (!wait) await changeActivePlayer();
            } catch (e) {
              console.log(e.response.data);
            }
          } else if (activePlayer === false) {
            try {
              await drawFromPlayer2Pile(usedCard).then(() =>
                putCardIntoPlayedCardsPile(usedCard)
              );
              if (!wait) await changeActivePlayer();
            } catch (e) {
              console.log(e.response.data);
            }
          }
          break;
      }
      toast.success("Good move");
      setIsRefreshed(!isRefreshed);
    } else {
      toast.error("You cannot play this card");
      setNumberOfErrors(numberOfErrors + 1);
    }
    if (numberOfErrors === 1) {
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
        await changeActivePlayer();
        toast.info("Picked a card.");
        setShowPickCardButton(false);
        setNumberOfErrors(0);
        setIsRefreshed(!isRefreshed);
      } catch (e) {
        console.log(e.response.data);
      }
    } else if (activePlayer === false) {
      try {
        await getCardsFromDeckCall(1).then((cards) =>
          putCardsIntoPlayer2Pile(cards)
        );
        await changeActivePlayer();
        toast.info("Picked a card.");
        setShowPickCardButton(false);
        setNumberOfErrors(0);
        setIsRefreshed(!isRefreshed);
      } catch (e) {
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
        {gameIsEnded && numberOfCardsPlayer1 === 0 ? (
          <h1>Player1 WIN!</h1>
        ) : gameIsEnded && numberOfCardsPlayer2 === 0 ? (
          <h1>Player2 WIN!</h1>
        ) : (
          <h1>Macao card game</h1>
        )}
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

          {haveToDraw ? (
            <button disabled>{`${cardsNumberToDraw} cards to draw`}</button>
          ) : (
            ""
          )}
          {haveToWait ? (
            <button disabled>{`${roundsToWait} rounds to wait`}</button>
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
            isDisabled={activePlayer || gameIsEnded}
          />
          <PlayField
            name="playedCards"
            refreshGame={isRefreshed}
            newGame={newGame}
          />
          <Player
            playerId={1}
            playerName="player1"
            shuffled={cardsAreShuffled}
            refreshGame={isRefreshed}
            onClick={handleCardClick}
            isDisabled={!activePlayer || gameIsEnded}
          />
        </div>
      </div>
      <div className="footer">
        <h3>
          Made by Alex Gheorghe as a coding challenge for Ensemble Software.
        </h3>
      </div>
    </div>
  );
};

export default MainPage;
