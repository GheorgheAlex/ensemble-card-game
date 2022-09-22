import React from "react";
import "./MainPage.css";
import Player from "../../components/PlayerComponent/Player.jsx";
import PlayField from "../../components/PlayFieldComponent/PlayField.jsx";

const MainPage = () => {
  return (
    <div className="main-page">
      <div className="header">
        <h1>Card game</h1>
      </div>
      <div className="content">
        <Player />
        <PlayField />
        <Player />
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
