import { TextField, Select, InputLabel, MenuItem, Grid, FormControl, Autocomplete } from '@mui/material';

import { useState, useEffect, useMemo } from 'react';


export default function Search ({cards, setCards}) {
  
  const [filteredCards, setFilteredCards] = useState([]);
  const [nameOptions, setNameOptions] = useState([])
  const [editionOptions, setEditionOptions] = useState([])
  const [inputValues, setInputValues] = useState({})


  useEffect(() => {
    getEditionOption()
  }, [cards, filteredCards]);


  const getEditionOption = async () => {
    try {
      const mtgSetUrl = "https://api.magicthegathering.io/v1/sets";
      const res = await fetch(mtgSetUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch Edition Set.');
      } 
      const data = await res.json();

      //* Check and remove Duplicate Cards in 'data' 
      const checkEditionList = new Set(); // Set.prototype.has()
      const reviseEditionList = data.sets.filter((set) => {
        if (checkEditionList.has(set.name)) {
          return false; // Skip Duplicate Edition Set
        } else {
          checkEditionList.add(set.name); // Set.prototype.add()
          return true; // Retain Non-Duplicate Edition Set
        }
      });
      // console.log("remove duplicate Sets:", reviseEditionList)
      let namesOnly = reviseEditionList.map(list => list.name)

      //* Set revise Edition list
      setEditionOptions(namesOnly)
      
    } catch (error) {
      console.error('Error fetching Sets:', error);
    }
  }


  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  
  const handleNameSelect = useMemo (
    () => debounce((event, newVal) => {
      event.preventDefault()
      setInputValues({...inputValues, 'name':newVal})
      getCardsByQuery('name', newVal)
      let listOfNames = cards.map(card => card.name)
      console.log('name', listOfNames)
      setNameOptions(listOfNames)
    }, 500), [cards]
  )

  
  const handleRaritySelect = (event) => {
    setInputValues({...inputValues, 'rarity':event.target.value})
    getCardsByQuery('rarity', event.target.value)
  }


  const handleEditionSelect = useMemo (
    () => debounce((event, newVal) => {
      event.preventDefault()
      setInputValues({...inputValues, 'setName':newVal})
      debounce(getCardsByQuery('setName', newVal), 250)
      let listOfName = cards.map(card => card.name)
      setNameOptions(listOfName)
    }, 500), [inputValues])

  
  const getCardsByQuery = async (category, value) => {
    const mtgSetUrl = `https://api.magicthegathering.io/v1/cards?${category}=${encodeURIComponent(value)}`;
    try {
      const res = await fetch(mtgSetUrl)
      if (!res.ok) {
        throw new Error('Failed to fetch Edition Set.');
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
 
      setCards(reviseCardList)
    } catch (error) {
        console.log(error)
    }
  }


  return (
    <>
      <div className='search-input'>
        
        <Grid container spacing={3} sx={{width:"100%", justifyContent:"Center", alignItems:"center"}}>
          <Grid item xs={12} sm={3}>
          <Autocomplete
            id="search-name"
            options={nameOptions}
            isOptionEqualToValue={(option, value) => 
              option.name === value.name
            }
            inputValue={inputValues.name}
            onInputChange={handleNameSelect}
            renderInput={(params) => 
              <TextField {...params} 
              label="Search by Card Name..." 
              />
            }
          />
          </Grid>  

          <Grid item xs={12} sm={3}>
            <Autocomplete
              id="search-setName"
              options={editionOptions}
              isOptionEqualToValue={(option, value) => 
                option.name === value.name
              }
              inputValue={inputValues.name}
              onInputChange={handleEditionSelect}
              renderInput={(params) => 
                <TextField {...params} 
                label="Search Set Name..." 
                />
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>   
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="rarity">Rarity Types</InputLabel>
            <Select
              labelId="rarity"
              id="search-rarity"
              label="Rarity Types"
              onChange={handleRaritySelect}
              defaultValue=""
            >
              <MenuItem value='common'>Common</MenuItem>
              <MenuItem value='uncommon'>Uncommon</MenuItem>
              <MenuItem value='rare'>Rare</MenuItem>
              <MenuItem value='mythic rare'>Mythic Rare</MenuItem>
            </Select>
            </FormControl>
          </Grid>
        </Grid>        

      </div>         
    </>
  ) 
}