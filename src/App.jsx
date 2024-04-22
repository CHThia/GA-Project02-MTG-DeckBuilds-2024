//* Import Pages
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CardListPage from './pages/CardListPage';
//* Import React Libraries
import { useState, useEffect } from 'react';
//* Import CSS
import "./CSS/styles.css"


export default function App() {

  const [cardLists, setCardLists] = useState([])
  const [filteredCardList, setFilteredCardList] = useState([])
  

  useEffect(() => {
    const mtgUrl = `https://api.magicthegathering.io/v1/cards`;
    
    const getAllCards = async () => {
      try {
        const res = await fetch(mtgUrl);
        if (!res.ok) {
          throw new Error('Failed to fetch game details');
        }
        const data = await res.json();

        //* Check and remove Duplicate Cards in 'data' 
        const checkCardList = new Set(); // Set.prototype.has()
        const reviseCardList = data.cards.filter((card) => {
          if (checkCardList.has(card.name)){
            return false; // Skip Duplicate Card
          } else {
            checkCardList.add(card.name);// Set.prototype.add()
            return true;  // Retain Non-Duplicate Card
          }
        })
        
        //* Set revise card list
        setCardLists(reviseCardList);
        setFilteredCardList(reviseCardList)
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    } 
    getAllCards()
  }, [])
  

  return (
    <>
      <NavBar />
      <HomePage cardLists={cardLists} onQuery={setFilteredCardList}/>
      
      <div className='card-list'>
        {filteredCardList.map((filteredCards, idx) => 
        <CardListPage key={idx} cardList={filteredCards} />
        )}
      </div>
    
    </>
  )
}
