import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/Search';
import DecksCollection from './pages/DecksCollection';
import CreateNewDeck from './pages/CreateNewDeck';
import EditDeck from './pages/EditDeck';
import "./CSS/styles.css";



export default function App() {

  return (
    <>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/decks/:deckName" element={<DecksCollection/>} />
        <Route path="/decks/create" element={<CreateNewDeck/>} />
        <Route path="/decks/:deckName/edit" element={<EditDeck/>} />
      </Routes>
      
    </>
  );
}
