import React, { useState, useEffect, memo, useCallback } from 'react';

const PhotoStack = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const photos = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400",
      alt: "Workshop Coding",
      title: "Workshop Coding"
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400", 
      alt: "Diskusi Tim",
      title: "Diskusi Tim"
    },
    {
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=400",
      alt: "Presentasi Project", 
      title: "Presentasi Project"
    },
    {
      src: "https://images.unsplash.com/photo-1515378791036-0648a814c963?auto=format&fit=crop&q=80&w=400",
      alt: "Coding Session",
      title: "Coding Session"
    },
    {
      src: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=400",
      alt: "Learning Together",
      title: "Learning Together"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [photos.length]);

  const handlePhotoClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const getPhotoStyle = useCallback((index) => {
    const diff = (index - currentIndex + photos.length) % photos.length;
    
    if (diff === 0) {
      return {
        zIndex: 30,
        transform: 'rotate(2deg) translateY(0px)',
        opacity: 1,
        scale: 1
      };
    } else if (diff === 1) {
      return {
        zIndex: 20,
        transform: 'rotate(-3deg) translateY(8px) translateX(-8px)',
        opacity: 0.8,
        scale: 0.95
      };
    } else if (diff === 2) {
      return {
        zIndex: 10,
        transform: 'rotate(6deg) translateY(16px) translateX(-16px)',
        opacity: 0.6,
        scale: 0.9
      };
    } else {
      return {
        zIndex: 0,
        transform: 'rotate(0deg) translateY(24px) translateX(-24px)',
        opacity: 0,
        scale: 0.85
      };
    }
  }, [currentIndex, photos.length]);

  return (
    <div className="relative">
      <div className="relative w-80 h-64">
        {photos.map((photo, index) => {
          const style = getPhotoStyle(index);
          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-64 h-48 bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white cursor-pointer transition-all duration-500 ease-out hover:scale-105"
              style={{
                zIndex: style.zIndex,
                transform: style.transform,
                opacity: style.opacity,
                scale: style.scale
              }}
              onClick={() => handlePhotoClick(index)}
            >
              <img 
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium">{photo.title}</p>
              </div>
            </div>
          );
        })}
        
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40">
          <span className="text-sm font-semibold">500+ Members</span>
        </div>
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              onClick={() => handlePhotoClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

PhotoStack.displayName = 'PhotoStack';

export default PhotoStack;
