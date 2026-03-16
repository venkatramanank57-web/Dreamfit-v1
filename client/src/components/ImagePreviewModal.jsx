// Updated ImagePreviewModal.jsx - Make sure to replace your existing file

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function ImagePreviewModal({ images, title, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const handlePrevious = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleThumbnailClick = (idx) => {
    setImageLoaded(false);
    setCurrentIndex(idx);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              {title || 'Image Preview'}
            </h3>
            <p className="text-sm text-slate-500">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              title="Download"
            >
              <Download size={20} className="text-slate-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              title="Close (Esc)"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          className="relative bg-slate-900 flex items-center justify-center p-4"
          style={{ minHeight: '500px', maxHeight: '70vh' }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`${title} ${currentIndex + 1}`}
            className={`max-w-full max-h-[65vh] object-contain rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error("Failed to load image:", images[currentIndex]);
              e.target.src = 'https://via.placeholder.com/500?text=Failed+to+load+image';
              setImageLoaded(true);
            }}
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Previous (←)"
              >
                <ChevronLeft size={24} className="text-slate-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Next (→)"
              >
                <ChevronRight size={24} className="text-slate-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="p-4 border-t bg-white overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                    idx === currentIndex 
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-110' 
                      : 'border-transparent hover:border-blue-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=Error';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}