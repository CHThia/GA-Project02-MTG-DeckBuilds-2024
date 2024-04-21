import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CardListPage from './pages/CardListPage';

import { useState, useEffect } from 'react';

import "./CSS/styles.css"


export default function App() {

  const [cardLists, setCardLists] = useState([]) 
  
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
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    } 
    getAllCards()
  }, [])
  
  return (
    <>
      <NavBar />
      <HomePage cardLists={cardLists}/>

      <div className='card-list'>
        {cardLists.map((cardList, idx) => 
        <CardListPage key={idx} cardList={cardList} />
        )}
      </div>
    
    </>
  )
}



//* Return
