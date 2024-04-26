import CardSlotsEdit from '../components/CardSlotsEdit';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'



export default function CreateNewDeck (){

  const location = useLocation();
  const {state} = location;
  const [searchCard, setSearchCard] = useState(""); 
  const [cardImage, setCardImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedCards, setAddedCards] = useState([]); 
  const [cardImageUrls, setcardImageUrls] = useState(state.deckData.fields['List of Cards'])


  
  //* CHANGE TO UPDATE
  const updateDeckToAirtable = async () => {
    const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
    const baseId = 'appDX6At2SO9TJoNE';
    const dataTable = 'tblEx46sKK00u8Tst';
    const recordId = state.deckData.id

    const url = `https://api.airtable.com/v0/${baseId}/${dataTable}/${recordId}`;
    
    const currentdate = new Date();
    const formattedDate = currentdate.toISOString();

    const requestBody = {
        fields: {
            "Last Update By": "CJ Thia",
            "Last Updated Date": formattedDate,
            "List of Cards": cardImageUrls.join(', ')
        }
    };

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log('Record updated deck successfully.');
        } else {
            console.error('Failed to update deck to Airtable:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating record:', error);
    }
};


  //* Fetch Card based on card name input 
  useEffect(() => {
  
    
  }, [searchCard, isLoading, cardImageUrls, addedCards]);
  
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
    } finally {
      setIsLoading(false)
    }
  };

  const handleSearchCard = (event) => {
    event.preventDefault()
    const cardNameInput = event.target.value
    console.log('cardNameInput', cardNameInput)
    setSearchCard(cardNameInput)
    if(cardNameInput.trim() === ""){
      setCardImage("");
      return
    } 
    getCardData(cardNameInput)
  };

  const handleAddCard = (event) => {
    event.preventDefault();
    if (cardImage) {
      setAddedCards([...addedCards, cardImage]);
      let currentArr = cardImageUrls
      let newArr = [...currentArr, cardImage]
      setcardImageUrls(newArr)
      console.log('t', cardImageUrls, cardImageUrls.length)
    }
  };

  const handleSaveDeck = (event) => {
    event.preventDefault();
    updateDeckToAirtable();
  };


  return (
    <>
      {/* To be removed */}
      <p style={{textAlign:"center"}}>Edit Deck</p>

      <div className='main-body'>

        {/* Search Deck & Search Card */}
        <div className='search-section'>

          <fieldset className='fieldset-search'>
            <legend>Search Section: </legend>
              <div>
                <div id="detail-search">
                  <label>Search Card Name: </label>
                  <input type='search' 
                    placeholder="Example: Black Lotus"
                    style={{width:"100%"}}
                    value={searchCard}
                    onChange={handleSearchCard}></input>
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

        {/* Update Deck Card Slots */}
        <CardSlotsEdit 
          cardImageUrls={cardImageUrls} 
          setcardImageUrls={setcardImageUrls}  
        />

        {/* Create New Deck Save Button */}
        <div className='btn-save-container'>
          <button id='save-btn' onClick={handleSaveDeck}>Save Deck</button>
        </div>

      </div>

    </>
  )
}