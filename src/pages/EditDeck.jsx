import CardSlots from '../components/CardSlots';
import { useEffect, useState } from 'react';


export default function EditDeck (){

  const [searchCard, setSearchCard] = useState("")
  const [cardImage, setCardImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [addedCards, setAddedCards] = useState([]) 
  const [deckName, setDeckName] = useState("")
  const [selectDeckName, setSelectDeckName] = useState([])
  const [cardImageUrls, setcardImageUrls] = useState([])


  //* Retrieve Deck Name 
  useEffect(() => {
    const getDeckNames = async () => {
    const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
    const baseId = 'appDX6At2SO9TJoNE';
    const dataTable = 'tblEx46sKK00u8Tst';
    
    const url = `https://api.airtable.com/v0/${baseId}/${dataTable}`;
    
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch deck names from Airtable.');
        }
    
        const data = await response.json();
        const decks = data.records.map(record => record.fields['Deck Name']);
    
        setSelectDeckName(decks);
      } catch (error) {
        console.error('Error fetching deck names:', error);
      }
    };
  
    getDeckNames();
  }, []);
  

  //* To show card images after selecting the Deck Set "Div"
  useEffect(() => {
    const getcardImageUrls = async () => {
      if (deckName) {
        const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
        const baseId = 'appDX6At2SO9TJoNE';
        const dataTable = 'tblEx46sKK00u8Tst';

        const url = `https://api.airtable.com/v0/${baseId}/${dataTable}?filterByFormula=({Deck Name}="${deckName}")`;

        try {
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch deck cards from Airtable.');
          }

          const data = await response.json();
          //* Retreive and tidy List of Cards from String to Array
          const cards = data.records.map((record) => record.fields["List of Cards"]);
          const splitCardImages = cards.flat().map(cardImageUrlString => 
          cardImageUrlString.split(',').map(cardImageUrl => cardImageUrl.trim()));
          const cardImagesArr = splitCardImages.flat();


          // Update state with fetched card URLs
          setcardImageUrls(cardImagesArr);
        } catch (error) {
          console.error('Error fetching deck card URLs:', error);
        }
      }
    };

    getcardImageUrls();
  }, [deckName]);


  //* CHANGE TO UPDATE 
  const saveDeckToAirtable = async () => {
    const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
    const baseId = 'appDX6At2SO9TJoNE';
    const dataTable = 'tblEx46sKK00u8Tst';

    const url = `https://api.airtable.com/v0/${baseId}/${dataTable}`;

    const currentdate = new Date();
    const formattedDate = currentdate.toISOString();

    const deckNameInput = deckName;

    const requestBody = {
        fields: {
            "ID": 2,
            "Create By": "CJ Thia",
            "Create Date": formattedDate,
            "Last Update By": "CJ Thia",
            "Last Updated Date": null,
            "Deck Name": deckNameInput,
            "List of Cards": addedCards.join(', ')
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log('Deck saved to Airtable successfully.');
        } else {
            console.error('Failed to save deck to Airtable:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving deck to Airtable:', error);
    }
};


  //* Fetch Card based on card name input 
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
      <div>
        <h1 style={{textAlign:"center", fontSize:"15px"}}>Edit Deck</h1>
      </div>

      <div className='main-body'>

        {/* Search Card Input */}
        <div className='search-section'>

        <form>
          <fieldset className='fieldset-deck-name'>
            <legend>Decks Selection: </legend>
              <div id="detail-deck-name">
                <label>Search Deck Name: </label>
                  <select value={deckName} onChange={handleDeckNameChange}>
                    <option value="">Select a deck</option>
                      {selectDeckName.map((dName, index) => (
                    <option key={index} value={dName}>{dName}</option>
                    ))}
                  </select>
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
        <CardSlots cardImages={cardImageUrls} setAddedCards={setAddedCards} />

        {/* Create New Deck Save Button */}
        <div className='btn-save-container'>
          <button id='save-btn' onClick={handleSaveDeck}>Save Deck</button>
        </div>

      </div>

    </>
  )
}