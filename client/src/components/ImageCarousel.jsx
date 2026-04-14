import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE4NSIgcj0iMTAiIGZpbGw9IiNEMUQ1REIiLz48cGF0aCBkPSJNMTUwIDIzMEwxODUgMjAwTDIxMCAyMjBMMjMwIDIwMEwyNTAgMjIwVjI0MEgxNTBWMjMwWiIgZmlsbD0iI0QxRDVEQiIvPjwvc3ZnPg==';

export default function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);

  const displayImages = images.length > 0 ? images : [FALLBACK_IMG];

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMG;
    e.target.classList.add('fallback-img');
  };

  return (
    <div className="carousel">
      <div className="carousel-thumbs">
        {displayImages.map((img, i) => (
          <div
            key={i}
            className={`carousel-thumb ${i === active ? 'active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <img src={img} alt={`Thumbnail ${i + 1}`} onError={handleImgError} />
          </div>
        ))}
      </div>
      <div className="carousel-main">
        <button
          className="carousel-nav carousel-prev"
          onClick={() => setActive((active - 1 + displayImages.length) % displayImages.length)}
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="carousel-image-wrap">
          <img
            src={displayImages[active]}
            alt="Product"
            className="carousel-image"
            onError={handleImgError}
          />
        </div>
        <button
          className="carousel-nav carousel-next"
          onClick={() => setActive((active + 1) % displayImages.length)}
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
