import ImageEnlarge from "../components/ImageEnlarge"
import { useState } from "react";



export default function CardListPage ({ cardlist }) {

  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImage(true);
  };

  const closeImage = () => {
    setShowImage(false);
  };

  return (
    <>
      <div className="card">
        <img style={{ width:"100px", padding:"15px"}} src={cardlist.imageUrl} 
          alt={cardlist.name}
          onClick={() => handleImageClick(cardlist.imageUrl)} 
        />
      </div>
      
      {showImage && (
        <ImageEnlarge imageUrl={selectedImage} onClose={closeImage} />
      )}
    </>
  )
} 