//* MaterialUI Libaries
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CardListPage from './CardListPage';
import { useState, useEffect } from 'react';



export default function HomePage () {
  
  const [cardLists, setCardLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 50;


  useEffect(() => {

    getAllCards(currentPage);
  }, [currentPage]);

  const getAllCards = async (page) => {
    const mtgUrl = `https://api.magicthegathering.io/v1/cards?page=${page}&pageSize=${pageSize}`;

    try {
      const res = await fetch(mtgUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch game details');
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

      //* Set revise card list
      setCardLists(reviseCardList);
      

      // Extract pagination information from headers (Recommended by MTG Provider)
      const linkHeader = res.headers.get('Link');
      const lastPage = linkHeader.match(/page=(\d+)>; rel="last"/);
      const totalPages = lastPage ? parseInt(lastPage[1]) : 1;
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching game data:', error);
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

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    const filteredCards = cardLists.filter((card) => {
      return card.name.toLowerCase().includes(keyword);
    });
    setCardLists(filteredCards);
  };


  return (
    <>
      <div className="title">
        <h1>MTG Deck Builds</h1>
      </div>

      <div className='search-input'>
        <Stack sx={{ width: 500 }}>
        
          <Autocomplete
            id="search-card"
            getOptionLabel={(cardLists) => `${cardLists.name}`}
            options={cardLists}
            isOptionEqualToValue={(option, value) => 
              option.name === value.name
            }
            noOptionsText={"There is no card of this name."}
            renderOption={(props, cardLists) => (
              <Box component="li" {...props} key={cardLists.id}>
                {cardLists.name}
              </Box>
            )}
            renderInput={(params) => 
            <TextField {...params} 
            label="Search Card..." 
            onChange={handleSearch} />}
          />
        
        </Stack>
      </div>   
      
      <div className='card-list'>
        {cardLists.map((cardlist, idx) => 
          <CardListPage key={idx} cardlist={cardlist} />
        )}
      </div> 

      {/* Pagination controls */}
      <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>

    </>
  ) 
}