import { useState } from "react";


export default function DecksCollection (){

  return (
    <>
      <div className="deck-collection-body">

        <div className="deck-library-container">
          <div id="deck-grp">
            <div id="deck-set"></div>
            <p id="icon-deck-name">Deck 1</p>
          </div>
          <div id="deck-grp">
            <div id="deck-set"></div>
            <p id="icon-deck-name">Deck 2</p>
          </div>

        </div>

        <div className="show-save-deck"></div>

      </div>
    </>
  )
}