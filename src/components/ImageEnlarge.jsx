
export default function ImageEnlarge ({ imageUrl, onClose }) {

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-content">
        <img src={imageUrl} alt="Enlarged" className="enlarged-image" />
      </div>
    </div>
  )
  
}

