import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { format, parseISO, isBefore } from 'date-fns';
import "../styles/eventos.css";
import defaultImage from '../assets/sinimagen.jpg';
import { fetchWithAuth, postWithAuth } from '../utils/api';

export const Eventos = () => {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('todos');
    const [filterModality, setFilterModality] = useState('todos');
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [subscribedEvents, setSubscribedEvents] = useState([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/eventos');
            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }
            const data = await response.json();
            setEvents(data);
            setFilteredEvents(data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchSubscribedEvents = async () => {
        try {
            setLoadingSubscriptions(true);
            const data = await fetchWithAuth('http://localhost:5000/api/suscrito');

            setSubscribedEvents(data.map(item => item.id_evento));
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoadingSubscriptions(false);
        }
    };

    const subscribeEvent = async (event) => {
        try {
            if(localStorage.getItem('token')){
                const data = await postWithAuth('http://localhost:5000/api/subscribirse', { 
                    id_evento: event.id_evento 
                });
                
                // Actualizar la lista de suscripciones después de suscribirse
                await fetchSubscribedEvents();
                
                return data;
            }else{
                alert("Necesitas logearte para suscribirte al evento");
            }

        } catch (err) {
            console.error('Error en subscribeEvent:', err.message);
            
            const errorMessage = err.message.includes('409') 
                ? 'Ya estás suscrito a este evento' 
                : 'Error al suscribirse al evento';
            
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchEvents();
        if(localStorage.getItem('token')){
            fetchSubscribedEvents();
        }else{
            setLoadingSubscriptions(false);
        }
    }, []);

    useEffect(() => {
        let results = events;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            results = results.filter(event =>
                event.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por tipo
        if (filterType !== 'todos') {
            results = results.filter(event => event.tipo === filterType);
        }

        // Filtrar por modalidad
        if (filterModality !== 'todos') {
            results = results.filter(event => event.modalidad === filterModality);
        }

        // Filtrar eventos pasados
        if (!showPastEvents) {
            results = results.filter(event => !isEventPast(event));
        }

        setFilteredEvents(results);
    }, [searchTerm, filterType, filterModality, showPastEvents, events]);

    const isEventPast = (event) => {
        // Extraer solo la parte de la fecha (sin hora)
        const fechaPart = event.fecha.split('T')[0]; // "2025-04-09"

        // Combinar con la hora del evento
        const fechaHoraString = `${fechaPart}T${event.hora}`; // "2025-04-09T11:00:00"

        // Parsear considerando la zona horaria local
        const eventDate = parseISO(fechaHoraString);

        return isBefore(eventDate, new Date());
    };

    const openEventDetails = (event) => {
        setSelectedEvent(event);
    };

    const closeEventDetails = () => {
        setSelectedEvent(null);
    };

    // Obtener tipos únicos para el filtro
    const eventTypes = [...new Set(events.map(event => event.tipo))];

    // Función para verificar si el usuario está suscrito a un evento
    const isSubscribed = (eventId) => {
        return subscribedEvents.includes(eventId);
    };

    return (
        <div className="eventos-container">
            <h1>{t('eventos.titulo')}</h1>

            <div className="filtros-checkbox">
                <input
                    type="checkbox"
                    id="showPastEvents"
                    checked={showPastEvents}
                    onChange={(e) => setShowPastEvents(e.target.checked)}
                />
                <label htmlFor="showPastEvents">Mostrar eventos pasados</label>
            </div>

            {/* Filtros de búsqueda */}
            <div className="filtros-container">
                <input
                    type="text"
                    placeholder={t('eventos.buscar')}
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="todos">{t('eventos.todos_tipos')}</option>
                    {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filterModality}
                    onChange={(e) => setFilterModality(e.target.value)}
                >
                    <option value="todos">{t('eventos.todas_modalidades')}</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrido">Híbrido</option>
                </select>
            </div>


            {/* Listado de eventos */}
            <div className="eventos-grid">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event.id_evento} className="evento-card">
                            <div className="evento-imagen-container">
                                <img
                                    src={event.imagen || defaultImage}
                                    alt={event.nombre}
                                    className="evento-imagen"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImage;
                                    }}
                                />
                                {isEventPast(event) && (
                                    <div className="evento-pasado-badge">{t('eventos.pasado')}</div>
                                )}
                            </div>

                            <div className="evento-info">
                                <h3>{event.nombre}</h3>
                                <p className="evento-fecha">
                                    {format(parseISO(event.fecha), 'dd/MM/yyyy')} • {event.hora} {isEventPast(event)}
                                </p>
                                <p className="evento-tipo">{event.tipo}</p>
                                <p className="evento-modalidad">
                                    {event.modalidad === 'virtual' ? 'Virtual' :
                                        event.modalidad === 'presencial' ? 'Presencial' : 'Híbrido'}
                                </p>

                                <div className="evento-acciones">
                                <button
                                    className="btn-info"
                                    onClick={() => openEventDetails(event)}
                                >
                                    {t('eventos.mas_info')}
                                </button>

                                <button
                                    className={`btn-subscribe ${
                                        isEventPast(event) || isSubscribed(event.id_evento) ? 'disabled' : ''
                                    } ${
                                        isSubscribed(event.id_evento) ? 'subscribed' : ''
                                    }`}
                                    onClick={() => !isEventPast(event) && !isSubscribed(event.id_evento) && subscribeEvent(event)}
                                    disabled={isEventPast(event) || isSubscribed(event.id_evento) || loadingSubscriptions}
                                >
                                    {loadingSubscriptions ? 'Cargando...' : 
                                     isSubscribed(event.id_evento) ? 'Suscrito ✓' : t('eventos.suscribirse')}
                                </button>
                            </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-eventos">{t('eventos.no_eventos')}</p>
                )}
            </div>

            {/* Modal de detalles del evento */}
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
                            className={`btn-subscribe ${
                                isEventPast(selectedEvent) || isSubscribed(selectedEvent.id_evento) ? 'disabled' : ''
                            } ${
                                isSubscribed(selectedEvent.id_evento) ? 'subscribed' : ''
                            }`}
                            onClick={() => !isEventPast(selectedEvent) && !isSubscribed(selectedEvent.id_evento) && subscribeEvent(selectedEvent)}
                            disabled={isEventPast(selectedEvent) || isSubscribed(selectedEvent.id_evento) || loadingSubscriptions}
                        >
                            {loadingSubscriptions ? 'Cargando...' : 
                             isSubscribed(selectedEvent.id_evento) ? 'Suscrito ✓' : t('eventos.suscribirse')}
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};