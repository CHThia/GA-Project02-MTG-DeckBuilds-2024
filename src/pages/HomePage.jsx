//* MaterialUI Libaries
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';


export default function HomePage ({ cardLists, onQuery }) {

  const handleSearch = (event) => {
    event.preventDefault();
    let keyword = event.target.value
    let filteredCards = cardLists.filter(card => card.name.includes(keyword))
    console.log('fi', filteredCards)
    onQuery(filteredCards)
  }


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
            onChange={handleSearch}
            />}
          />
        
        </Stack>
      </div>
    </>
  ) 
}