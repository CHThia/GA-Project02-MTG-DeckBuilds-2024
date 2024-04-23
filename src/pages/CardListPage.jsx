import ImageEnlarge from "../components/ImageEnlarge"
import { useState } from "react";



export default function CardListPage ({ cardlist }) {

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="card">
        <img style={{ width:"100px", padding:"15px"}} src={cardlist.imageUrl} 
          alt={cardlist.name}
          onClick={() => handleImageClick(cardlist.imageUrl)} 
        />
      </div>
      
      {showModal && (
        <ImageEnlarge imageUrl={selectedImage} onClose={closeModal} />
      )}
    </>
  )
} 