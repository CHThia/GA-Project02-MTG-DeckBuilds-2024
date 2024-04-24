import CardSlots from '../components/CardSlots';
import { useEffect, useState } from 'react';
import Airtable from 'airtable';


export default function CreateNewDeck (){

  const [searchCard, setSearchCard] = useState(""); 
  const [cardImage, setCardImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedCards, setAddedCards] = useState([]); 
  const [deckName, setDeckName] = useState("");


  
  //* Function to save deck data to Airtable
  const saveDeckToAirtable = async () => {
    const base = new Airtable({ 
      apiKey: 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f' })
      .base('appDX6At2SO9TJoNE');
    const dataTable = 'tblEx46sKK00u8Tst'
    const deckNameInput = deckName;
    const currentdate = new Date();
    const formattedDate = currentdate.toISOString();

    try {
      await base(dataTable).create({
        "ID": 2,
        "Create By": "CJ Thia",
        "Create Date": formattedDate,
        "Last Update By": "CJ Thia",
        "Last Updated Date": null,
        "Deck Name": deckNameInput,
        "List of Cards": addedCards.join(', ') // Assuming addedCards is an array of card names
      });
      console.log('Deck saved to Airtable successfully.');
    } catch (error) {
      console.error('Error saving deck to Airtable:', error);
    }
  };


  useEffect(() => {

    const getCardData = async () => {

      if(!searchCard) {
        setCardImage("")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
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
      } finally {
        setIsLoading(false)
      }
    };

    getCardData();
  }, [searchCard]);

  const handleSearchCardInput = (event) => {
    const cardNameInput = event.target.value
    setSearchCard(cardNameInput);
    if(cardNameInput.trim() === ""){
      setCardImage("");
      return
    } 
  };

  const handleAddCard = (event) => {
    event.preventDefault();
    if (cardImage) {
      setAddedCards([...addedCards, cardImage]);
    }
  };

  const handleSaveDeck = (event) => {
    event.preventDefault();
    saveDeckToAirtable();
  };

  const handleDeckNameChange = (event) => {
    setDeckName(event.target.value);
  }


  return (
    <>
      <div className='main-body'>


        {/* Search Card Input */}
        <div className='search-section'>

        <form>
          <fieldset className='fieldset-deck-name'>
            <legend>Deck Name Section: </legend>
              <div id="detail-deck-name">
                <label>Enter Deck Name: </label>
                <input type='text' 
                  placeholder="Example: Deck 1" 
                  style={{width:"100%"}}
                  value={deckName}
                  onChange={handleDeckNameChange}>
                </input>
              </div>
          </fieldset>
        </form>

          <fieldset className='fieldset-search'>
            <legend>Search Section: </legend>
              <div>
                <div id="detail-search">
                  <label>Search Card Name: </label>
                  <input type='search' 
                    placeholder="Example: Black Lotus"
                    style={{width:"100%"}}
                    value={searchCard}
                    onChange={handleSearchCardInput}></input>
                </div>
              </div>

              <div id='show-card'>
                {isLoading? (
                    <p>Image is Loading... </p>
                  ) : (
                    cardImage && <img src={cardImage} id='card-image'/>
                  )}
              </div>
              
              <div className='btn-add-container'>
                <button id='add-btn' onClick={handleAddCard}>ADD CARD</button>
              </div>
          </fieldset>
        </div>

        {/* Create New Deck Card Slots */}
        <CardSlots cardImages={addedCards} setAddedCards={setAddedCards} />

        {/* Create New Deck Save Button */}
        <div className='btn-save-container'>
          <button id='save-btn' onClick={handleSaveDeck}>Save Deck</button>
        </div>

      </div>

    </>
  )
}