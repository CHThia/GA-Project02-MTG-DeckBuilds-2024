import { useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom"


export default function DecksCollection (){

  const [allDecks, setAllDecks] = useState([])
  const [selectDeck, setSelectDeck] = useState(null)
  const [deckCards, setDeckCards] = useState([])
  const [selectedDeckData, setSelectedDeckData] = useState([])

  
  const navigate = useNavigate()
  const params = useParams()
  

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
                navigate(`/decks/${deckNames[0]}`)
                let deckSet = cleanCardData(data.records[0])
                setDeckCards(deckSet);
                data.records[0]['fields']['List of Cards'] = deckSet
                console.log(data.records[0])
                setSelectedDeckData(data.records[0])

                console.log('All Data retreived from Airtable is successfully.');
            } else {
                console.error('Failed to retreive all Data from Airtable:', response.statusText);
            }
        } catch (error) {
            console.error('Error retreiving all Data from Airtable:', error);
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

              const cardImagesArr = cleanCardData(data.records[0])
              setDeckCards(cardImagesArr);
              navigate(`/decks/${selectDeck}`)
              let listOfCardImages = cleanCardData(data.records[0])
              data.records[0]['fields']['List of Cards'] = listOfCardImages 
              setSelectedDeckData(data.records[0])

              console.log('All card-images retreived from Airtable is successfully.');
            } else {
              console.error('Failed to retreive card-images from Airtable:', response.statusText);
            }
          } catch (error) {
              console.error('Error retreiving cards from Airtable:', error);
          }
      };
      
    getCardsFromAirtable()
    }
  }, [selectDeck, navigate])


  const handleDeckClick = (deckName) => {
    setSelectDeck(deckName);
  }

  const cleanCardData = (cardObj) => {
        let cards = cardObj['fields']['List of Cards']
        let splitCardImages = cards.split(',').map(cardImageUrl => cardImageUrl.trim())
        return splitCardImages;
  }

  const handleEditDeck = (event) => {
    event.preventDefault();
    console.log('selectedDeckData', selectedDeckData)
    let {deckName} = params;
    navigate(`/decks/${deckName}/edit`, {state: {deckName: deckName, deckData: selectedDeckData} }) 
    //add selectedDeckData to pass to next component
  }


  //* To Delete Deck from AirTable by selected deck 
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

        <div className="btn-delete-container">
          <button id="edit-btn" onClick={handleEditDeck}>Edit Deck</button>
          <button id="delete-btn" onClick={handleDeleteDeck}>Delete Deck</button>
        </div>
            
      </div>
    </>
  )
}