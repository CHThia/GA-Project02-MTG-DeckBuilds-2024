import CardSlots from '../components/CardSlots';
import { useEffect, useState } from 'react';



export default function CreateNewDeck (){

  const [searchCard, setSearchCard] = useState(""); 
  const [cardImage, setCardImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedCards, setAddedCards] = useState([]); 


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
      setCardImage(""); 
    }
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
                  <input type='text' 
                    placeholder="Example: Deck 1" 
                    style={{width:"100%"}}>
                  </input>
                </div>

                <div id="detail-input">
                  <label>Create Date: </label>
                  <input type='date'
                    placeholder='Input Card Name...' 
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
        </form>

        {/* Create New Deck Card Slots */}
        <CardSlots cardImages={addedCards} setAddedCards={setAddedCards} />

        {/* Create New Deck Save Button */}
        <div className='btn-save-container'>
          <button id='save-btn'>Save Deck</button>
        </div>

      </div>

    </>
  )
}