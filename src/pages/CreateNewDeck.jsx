import { useState} from 'react';



export default function CreateNewDeck (){

  const [searchCard, setSearchCard] = useState([]);

  // Create 60 slots for placing cards 
  const deckTable = [];
  for(let i = 0; i < 60; i++){
    deckTable.push(<div key={i} className='card-slot'>Empty Slot</div>)
  }


  return (
    <>
      <div className='main-body'>

        {/* Create New Deck Section */}
        <webform>

          <fieldset className='fieldset-container'>
            <legend>Create New Deck</legend>
              <div>
                <div id="detail-input">
                  <label>Deck Name: </label>
                  <input type='text' style={{width:"100%"}}></input>
                </div>

                <div id="detail-input">
                  <label>Create Date: </label>
                  <input type='date' pattern="\d{2}-\d{2}-\d{4}" style={{width:"100%"}}></input>
                </div>

                <div id="detail-input">
                  <label>Search Card: </label>
                  <input type='search' style={{width:"100%"}}></input>
                </div>
              </div>

              <div id='show-card'></div>
        
          </fieldset>
        </webform>

        <div className='create-deck-container'>{deckTable}</div>

      </div>

    </>
  )
}