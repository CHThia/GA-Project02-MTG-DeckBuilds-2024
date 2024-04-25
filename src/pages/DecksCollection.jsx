import { useEffect, useState } from "react";



export default function DecksCollection (){

  const [allDecks, setAllDecks] = useState([]);
  const [selectDeck, setSelectDeck] = useState(null);
  const [deckCards, setDeckCards] = useState([])
 

  //* To retrieve the store data from AirTable
  useEffect(() => {
      const getDecksFromAirtable = async () => {
        const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
        const baseId = 'appDX6At2SO9TJoNE';
        const dataTable = 'tblEx46sKK00u8Tst';
    
        const url = `https://api.airtable.com/v0/${baseId}/${dataTable}`;
    
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                const deckNames = data.records.map((record) => record.fields["Deck Name"]);
                setAllDecks(deckNames);
                console.log('All decks retreived from Airtable is successfully.');
            } else {
                console.error('Failed to retreive all decks from Airtable:', response.statusText);
            }
        } catch (error) {
            console.error('Error retreiving all decks from Airtable:', error);
        }
    };
    
    getDecksFromAirtable()
  }, [])


  //* To show card images after selecting the Deck Set "Div"
  useEffect(() => {

    if(selectDeck) {
      const getCardsFromAirtable = async () => {
        const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
        const baseId = 'appDX6At2SO9TJoNE';
        const dataTable = 'tblEx46sKK00u8Tst';
    
        const url = `https://api.airtable.com/v0/${baseId}/${dataTable}?filterByFormula=({Deck Name}='${selectDeck}')`;
    
        try {
            const response = await fetch(url, {
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
              const data = await response.json();
              
              //* Tidy List of Cards from String to Array
              const cards = data.records.map((record) => record.fields["List of Cards"]);
              const splitCardImages = cards.flat().map(cardImageUrlString => 
                cardImageUrlString.split(',').map(cardImageUrl => cardImageUrl.trim()));
              const cardImagesArr = splitCardImages.flat();
                
              setDeckCards(cardImagesArr);

              console.log('All cards retreived from Airtable is successfully.');
            } else {
              console.error('Failed to retreive cards from Airtable:', response.statusText);
            }
          } catch (error) {
              console.error('Error retreiving cards from Airtable:', error);
          }
      };
      
    getCardsFromAirtable()
    }
  }, [selectDeck])


  const handleDeckClick = (deckName) => {
    setSelectDeck(deckName);
  }


  const handleDeleteDeck = async () => {
    if (!selectDeck) return;
  
    const apiKey = 'pat6QkNwJX0WR859A.d3064ffa2324742e57995d79c52a033bce10ce0c17374ed6b9d87ae14ea4c77f';
    const baseId = 'appDX6At2SO9TJoNE';
    const dataTable = 'tblEx46sKK00u8Tst';
    const url = `https://api.airtable.com/v0/${baseId}/${dataTable}`;
  
    try {
      // Fetch the record ID of the selected deck
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Find the record ID of the selected deck
        const deckRecord = data.records.find(record => record.fields["Deck Name"] === selectDeck);
        if (!deckRecord) {
          console.error(`Deck '${selectDeck}' not found in Airtable.`);
          return;
        }
        
        const deckId = deckRecord.id;
  
        // Construct URL for DELETE request with the record ID
        const deleteUrl = `${url}/${deckId}`;
  
        // Send DELETE request
        const deleteResponse = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
  
        if (deleteResponse.ok) {
          console.log(`Deck '${selectDeck}' deleted successfully.`);
          // Update state to remove the deleted deck
          setAllDecks(prevDecks => prevDecks.filter(deck => deck !== selectDeck));
          setSelectDeck(null);
          setDeckCards([]);
        } else {
          console.error('Failed to delete deck from Airtable:', deleteResponse.statusText);
        }
      } else {
        console.error('Failed to fetch records from Airtable:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting deck from Airtable:', error);
    }
  };
  
  
  return (
    <>
      <div className="deck-collection-body">

        <div className="deck-library-container">
          {/* To make an array of divs based on the number of data in airtable */}
          {allDecks.map((deckName, index) => (
            <div className="deck-grp" key={index} onClick={() => handleDeckClick(deckName)}>
              <div className="deck-set"></div>
              <p className="icon-deck-name">{deckName}</p>
            </div>
          ))}

        </div>

        <div className="show-save-deck">
          <div className="card-container">
            <div className="card-list">
              {deckCards.length > 0 ? (
                deckCards.map((cardUrl, index) => (
                  <img src={cardUrl} alt={`Card ${index + 1}`} key={index} className="card-image" />
                ))
              ) : (
                <p>No cards found for the selected deck.</p>
              )}
            </div>
          </div>
        </div>

            <div className="btn-remove-container">
              <button id="delete-btn" onClick={handleDeleteDeck}>Delete Deck</button>
            </div>
            
      </div>
    </>
  )
}