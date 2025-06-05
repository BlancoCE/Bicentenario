import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postWithAuth } from '../utils/api';
import { useTranslation } from "react-i18next";
import defaultImage from '../../public/assets/sinimagen.jpg';
import { format, parseISO, isBefore } from 'date-fns';
import "../styles/5eventos.css";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const navigate = useNavigate();

  const fetch5Events = async () => {
    try {
      const response = await fetch('https://bicentenario-production.up.railway.app/api/5eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      setEvents(data);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const subscribeEvent = async (event) => {
    try {
      if(!localStorage.getItem('token')){
        alert("Necesitas logarte primero");
        return;
      }
      const data = await postWithAuth('https://bicentenario-production.up.railway.app/api/subscribirse', event);
      return data;
    } catch (err) {
      console.error('Error en subscribeEvent:', err.message);
      
      const errorMessage = err.response?.status === 409 
        ? 'Ya estás suscrito a este evento' 
        : 'Error al suscribirse al evento';
      
      throw new Error(errorMessage);
    }
  };

  // Nueva función para generar el QR
  const generateQR = async (eventId) => {
    setQrLoading(true);
    try {
      const response = await fetch(`https://bicentenario-production.up.railway.app/api/eventos/${eventId}/qr`);
      if (!response.ok) {
        throw new Error('Error al generar el código QR');
      }
      const qrSvg = await response.text();
      setQrCode(qrSvg);
      setShowQrModal(true);
    } catch (err) {
      console.error('Error generando QR:', err.message);
      alert('Error al generar el código QR');
    } finally {
      setQrLoading(false);
    }
  };

  // Función para cerrar el modal del QR
  const closeQrModal = () => {
    setShowQrModal(false);
    setQrCode(null);
  };

  // Función para descargar el QR como imagen
  const downloadQR = () => {
    if (!qrCode || !selectedEvent) return;
    
    const blob = new Blob([qrCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-${selectedEvent.nombre.replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetch5Events();
  }, []);

  useEffect(() => {
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
    // También cerrar el modal QR si está abierto
    if (showQrModal) {
      closeQrModal();
    }
  };

  const isEventPast = (event) => {
    const fechaPart = event.fecha.split('T')[0];
    const fechaHoraString = `${fechaPart}T${event.hora}`;
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

  const getDisplayText = (text, maxLength) => {
    if (!text) return 'Descripción no disponible';
    if (text.length <= maxLength || expandedDescription) return text;
    return `${text.substring(0, maxLength)}...`;
  };

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

  const renderCurrentEvent = () => {
    const currentEvent = events[currentIndex];
    const description = currentEvent.descripcion || 'Descripción no disponible';
    const isLongDescription = description.length > 150;

    return (
      <div className="event-card">
        <div className="event-image-container">
          
          <img

            src={currentEvent.imagen ? `./assets/${currentEvent.imagen}` : defaultImage}
            alt={currentEvent.imagen}
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

      {/* Modal de detalles del evento */}
      {selectedEvent && (
        <div className="evento-modal">
          <div className="evento-modal-content">
            <div className="modal-header">
              <button className="close-modal" onClick={closeEventDetails}>×</button>
              <img
                src={selectedEvent.imagen ? `./assets/${selectedEvent.imagen}` : defaultImage}
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
              <button 
                className={`QR ${qrLoading ? 'loading' : ''}`}
                onClick={() => generateQR(selectedEvent.id_evento)}
                disabled={qrLoading}
              >
                {qrLoading ? 'Generando...' : 'Generar QR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del código QR */}
      {showQrModal && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>Código QR</h3>
              <button className="close-qr-modal" onClick={closeQrModal}>×</button>
            </div>
            <div className="qr-modal-body">
              {qrCode && (
                <div 
                  className="qr-code-container"
                  dangerouslySetInnerHTML={{ __html: qrCode }}
                />
              )}
              <p className="qr-description">
                Escanea este código QR para acceder directamente al registro del evento
              </p>
            </div>
            <div className="qr-modal-footer">
              <button className="btn-download-qr" onClick={downloadQR}>
                Descargar QR
              </button>
              <button className="btn-close-qr" onClick={closeQrModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;