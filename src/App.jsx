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
        <Route path="/Home" element={<HomePage/>} />
        <Route path="Decks Collection" element={<DecksCollection/>} />
        <Route path="Create New Deck" element={<CreateNewDeck/>} />
        <Route path="Edit Deck" element={<EditDeck/>} />
      </Routes>
      
    </>
  );
}
