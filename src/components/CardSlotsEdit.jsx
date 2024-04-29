
export default function CardSlotsEdit ({ cardImageUrls, setcardImageUrls }) {

  const handleRemoveCard = (event, index) => {
    event.preventDefault()
    const newCardImages = [...cardImageUrls];
    newCardImages.splice(index, 1)
    setcardImageUrls(newCardImages)
  }

  // Create 60 slots for placing cards 
  const deckTable = [];
  for (let i = 0; i < 60; i++) {
    deckTable.push(
      <div key={i} className='card-slot'>
        {i < cardImageUrls.length ? (
          <img src={cardImageUrls[i]} 
            alt={`Card ${i + 1}`} 
            className="card-slot"
            onClick={(event) => handleRemoveCard(event, i)}
          />
        ) : (
          "Empty Slot"
        )}
      </div>
    );
  }

  return (
    <>
       <div className='create-deck-container'>{deckTable}</div>
    </>
  )
}