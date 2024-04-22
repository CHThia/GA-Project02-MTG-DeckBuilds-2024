import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import DecksCollection from './pages/DecksCollection';
import CardListPage from './pages/CardListPage';
import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react';
import "./CSS/styles.css";



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
        <Routes>
          <Route path="/Home" 
          element={<HomePage cardLists={cardLists} 
          onQuery={setFilteredCardList}/>} 
          />
          <Route path="Decks Collection" element={<DecksCollection/>} />
        </Routes>
        
        <div className='card-list'>
          {filteredCardList.map((filteredCards, idx) => 
          <CardListPage key={idx} filteredCards={filteredCards} />
        )}
        </div>
    </>
  )
}
