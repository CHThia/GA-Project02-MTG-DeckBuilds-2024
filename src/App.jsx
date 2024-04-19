import { useState, useEffect } from 'react';
import SearchPage from './pages/SearchPage';
import CardListPage from './pages/CardListPage';

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
      <h1>Welcome to Magic The Gathering</h1>
      <SearchPage />
      {cardLists.map((cardList, idx) => 
      <CardListPage key={idx} cardList={cardList} />
    )}
    </>
  )
}