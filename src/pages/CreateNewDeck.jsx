import CardSlots from '../components/CardSlots';
import { useEffect, useState } from 'react';



export default function CreateNewDeck (){

  const [searchCard, setSearchCard] = useState(""); 
  const [cardImage, setCardImage] = useState(""); 

  useEffect(() => {

    const getCardData = async () => {
      
      const mtgUrl = `https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(searchCard)}`;

      try {
        const res = await fetch(mtgUrl);
        if (!res.ok) {
          throw new Error('Failed to fetch card.');
        }
        const data = await res.json();

        //* Check if Card name is available
        if (data.cards && data.cards.length > 0) {
          setCardImage(data.cards[0].imageUrl); // Show Card Image if there is result
        } else {
          setCardImage(""); // Clear Card Image if not result
        }

      } catch (error) {
        console.error('Error fetching card:', error);
      }
    };

    getCardData();
  }, [searchCard]);

  const handleSearchCardInput = (event) => {
    setSearchCard(event.target.value); // Update searchCard state with input value
  };


  return (
    <>
      <div className='main-body'>

        {/* Create New Deck Inputs */}
        <form>

          <fieldset className='fieldset-container'>
            <legend>Create New Deck</legend>
              <div>
                <div id="detail-input">
                  <label>Deck Name: </label>
                  <input type='text' style={{width:"100%"}}></input>
                </div>

                <div id="detail-input">
                  <label>Create Date: </label>
                  <input type='date' 
                    pattern="\d{2}-\d{2}-\d{4}" 
                    style={{width:"100%"}}></input>
                </div>

                <div id="detail-input">
                  <label>Search Card: </label>
                  <input type='search' 
                    style={{width:"100%"}}
                    value={searchCard}
                    onChange={handleSearchCardInput}></input>
                </div>
              </div>

              <div id='show-card'>
                {cardImage && <img src={cardImage} />}
              </div>
        
          </fieldset>
        </form>

        {/* Create New Deck Card Slots */}
        <CardSlots />

        {/* Create New Deck Save Button */}
        <div className='btn-save-container'>
          <button id='save-btn'>Save Deck</button>
        </div>

      </div>

    </>
  )
}