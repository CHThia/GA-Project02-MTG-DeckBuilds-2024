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
  const [filteredList, setFilteredList] = useState([])
  
  useEffect(() => {
    const mtgUrl = `https://api.magicthegathering.io/v1/cards`;
    
    const getAllCards = async () => {
      try {
        const res = await fetch(mtgUrl);
        if (!res.ok) {
          throw new Error('Failed to fetch game details');
        }
        const data = await res.json();
        setCardLists(data.cards);
        setFilteredList(data.cards)
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    } 
    getAllCards()
  }, [])
  

  return (
    <>
      <NavBar />
      <HomePage cardLists={cardLists} onQuery={setFilteredList}/>
      
      <div className='card-list'>
        {filteredList.map((filteredList, idx) => 
        <CardListPage key={idx} cardList={filteredList} />
        )}
      </div>
    
    </>
  )
}
