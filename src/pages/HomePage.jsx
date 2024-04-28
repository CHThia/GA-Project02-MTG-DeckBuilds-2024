import CardListPage from './CardListPage';
import Search from '../components/Search'
import { useState, useEffect } from 'react';



export default function HomePage () {
  
  const [cardLists, setCardLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    getAllCards(currentPage);
  }, [currentPage, totalPages]);
  
  const getAllCards = async (page) => {
    const mtgUrl = `https://api.magicthegathering.io/v1/cards?page=${page}`;

    try {
      const res = await fetch (mtgUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch card list');
      }
      const data = await res.json();

      //* Check and remove Duplicate Cards in 'data' 
      const checkCardList = new Set(); // Set.prototype.has()
      const reviseCardList = data.cards.filter((card) => {
        if (checkCardList.has(card.name)) {
          return false; // Skip Duplicate Card
        } else {
          checkCardList.add(card.name); // Set.prototype.add()
          return true; // Retain Non-Duplicate Card
        }
      });
      console.log("remove duplicate Cards:", reviseCardList)

      //* Set revise card list
      setCardLists(reviseCardList);
      

      // Extract pagination information from headers (Recommended by MTG Provider)
      const linkHeader = res.headers.get('Link');
      const lastPage = linkHeader.match(/page=(\d+)>; rel="last"/);
      const totalPages = lastPage ? parseInt(lastPage[1]) : 1;
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching card list data:', error);
    }
  };
  

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <>
      <div className="title">
        <h1>Magic The Gathering: Deck Builds</h1>
      </div>

      <Search cards={cardLists} setCards={setCardLists}  />
      
      <hr/>

      <div className='card-list-container'>
        <div id='card-list'>
          {cardLists.map((cardlist, idx) => 
            <CardListPage key={idx} cardlist={cardlist} />
          )}
        </div> 
      </div>

      <hr/>

      <div id='page-controls'>
        <button 
          style={{ width: "30%" }}
          onClick={handlePrevPage} 
          disabled={currentPage === 1}>
            Previous Page
        </button>
        <button 
          style={{ width: "30%" }}
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}>
            Next Page
        </button>
      </div>

    </>
  ) 
}