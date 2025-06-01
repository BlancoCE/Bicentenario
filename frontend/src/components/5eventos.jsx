import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postWithAuth } from '../utils/api';
import { useTranslation } from "react-i18next";
import defaultImage from '../assets/sinimagen.jpg';
import { format, parseISO, isBefore } from 'date-fns';
import "../styles/5eventos.css";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const fetch5Events = async () => {
    try {
      const response = await fetch('https://bicentenario-production.up.railway.app/api/5eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const subscribeEvent = async (event) => {
    try {
      const data = await postWithAuth('http://localhost:5000/api/subscribirse', event);
      return data; // Retorna los datos para que el componente pueda usarlos
    } catch (err) {
      console.error('Error en subscribeEvent:', err.message);
      
      // Puedes personalizar el mensaje de error según el tipo de error
      const errorMessage = err.response?.status === 409 
        ? 'Ya estás suscrito a este evento' 
        : 'Error al suscribirse al evento';
      
      throw new Error(errorMessage); // Re-lanza el error para manejo en el componente
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

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const isEventPast = (event) => {
    // Extraer solo la parte de la fecha (sin hora)
    const fechaPart = event.fecha.split('T')[0]; // "2025-04-09"

    // Combinar con la hora del evento
    const fechaHoraString = `${fechaPart}T${event.hora}`; // "2025-04-09T11:00:00"

    // Parsear considerando la zona horaria local
    const eventDate = parseISO(fechaHoraString);

    return isBefore(eventDate, new Date());
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
            src={currentEvent.foto || defaultImage}
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
              onClick={() => openEventDetails(currentEvent)}
            >
              Más información
            </button>

            <button 
              className="action-button subscribe"
              onClick={() => subscribeEvent(currentEvent)}>
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
      {selectedEvent && (
        <div className="evento-modal">
          <div className="evento-modal-content">


            <div className="modal-header">
              <button className="close-modal" onClick={closeEventDetails}>×</button>
              <img
                src={selectedEvent.imagen || defaultImage}
                alt={selectedEvent.nombre}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <h2>{selectedEvent.nombre}</h2>
            </div>

            <div className="modal-body">
              <p><strong>Fecha:</strong> {format(parseISO(selectedEvent.fecha), 'PPPP')}</p>
              <p><strong>Hora:</strong> {selectedEvent.hora}</p>
              {selectedEvent.fecha_final && (
                <p><strong>Fecha final:</strong> {format(parseISO(selectedEvent.fecha_final), 'PPPP')}</p>
              )}
              {selectedEvent.hora_final && (
                <p><strong>Hora final:</strong> {selectedEvent.hora_final}</p>
              )}
              <p><strong>Tipo:</strong> {selectedEvent.tipo}</p>
              <p><strong>Modalidad:</strong> {selectedEvent.modalidad}</p>
              {selectedEvent.modalidad === 'virtual' ? (
                <p><strong>Enlace:</strong> <a href={selectedEvent.lugar} target="_blank" rel="noopener noreferrer">{selectedEvent.lugar}</a></p>
              ) : (
                <p><strong>Lugar:</strong> {selectedEvent.lugar}</p>
              )}
              <p><strong>Descripción:</strong></p>
              <p>{selectedEvent.descripcion}</p>
              {selectedEvent.contacto && (
                <p><strong>Contacto:</strong> {selectedEvent.contacto}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                className={`btn-subscribe ${isEventPast(selectedEvent) ? 'disabled' : ''}`}
                onClick={() => !isEventPast(selectedEvent) && subscribeEvent(selectedEvent)}
                disabled={isEventPast(selectedEvent)}
              >
                {t('eventos.suscribirse')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;