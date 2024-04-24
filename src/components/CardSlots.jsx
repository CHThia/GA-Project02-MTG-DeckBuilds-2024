
export default function CardSlots () {

  // Create 60 slots for placing cards 
  const deckTable = [];
  for(let i = 0; i < 60; i++){
    deckTable.push(<div key={i} className='card-slot'>Empty Slot</div>)
  }


  return (
    <>
       <div className='create-deck-container'>{deckTable}</div>
    </>
  )
}