import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sinImagen from '../assets/sinimagen.jpg';
import "../styles/5eventos.css";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const navigate = useNavigate();
  
  const fetch5Events = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/5eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  
  useEffect(() => {
    fetch5Events();
  }, []);
  
  useEffect(() => {
    // Reset expandedDescription when changing events
    setExpandedDescription(false);
  }, [currentIndex]);
  
  const nextEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };
  
  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };
  
  // Función para mostrar el texto completo o truncado
  const getDisplayText = (text, maxLength) => {
    if (!text) return 'Descripción no disponible';
    if (text.length <= maxLength || expandedDescription) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  // Renderizar un evento vacío si no hay eventos
  const renderEmptyEvent = () => (
    <div className="event-card">
      <div className="event-image-container">
      </div>
      
      <div className="event-content">
        <h3 className="event-title">No hay eventos disponibles</h3>
        <p className="event-description">
          Actualmente no hay eventos programados. Por favor, revisa más tarde.
        </p>
        
        <div className="event-actions">
          <button
            className="action-button info"
            onClick={() => navigate('/eventos')}
          >
            Ver calendario
          </button>
        </div>
      </div>
    </div>
  );
  
  // Renderizar un evento actual si hay eventos
  const renderCurrentEvent = () => {
    const currentEvent = events[currentIndex];
    const description = currentEvent.descripcion || 'Descripción no disponible';
    const isLongDescription = description.length > 150;
    
    return (
      <div className="event-card">
        <div className="event-image-container">
          <img
            src={currentEvent.foto || sinImagen}
            alt={currentEvent.nombre}
            className="event-image"
          />
        </div>
        
        <div className="event-content">
          <h3 className="event-title">{currentEvent.nombre}</h3>
          <div className={`event-description-container ${expandedDescription ? 'expanded' : ''}`}>
            <p className="event-description">
              {getDisplayText(description, 150)}
            </p>
            {isLongDescription && (
              <button 
                className="read-more-button" 
                onClick={toggleDescription}
              >
                {expandedDescription ? 'Leer menos' : 'Leer más...'}
              </button>
            )}
          </div>
          
          <div className="event-actions">
            <button
              className="action-button info"
              onClick={() => navigate(`/eventos/${currentEvent.id}`)}
            >
              Más información
            </button>
            
            <button className="action-button subscribe">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="event-carousel-container">
      <h2 className="carousel-title">Eventos Destacados</h2>
      
      <div className="event-carousel">
        <button className="nav-button prev" onClick={prevEvent}>&lt;</button>
        
        {events.length === 0 ? renderEmptyEvent() : renderCurrentEvent()}
        
        <button className="nav-button next" onClick={nextEvent}>&gt;</button>
      </div>
      
      <div className="carousel-footer">
        <button
          className="view-all-button"
          onClick={() => navigate('/eventos')}
        >
          Ver todos los eventos
        </button>
        
        <div className="carousel-indicators">
          {events.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;