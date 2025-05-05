import logo from '../assets/Bicentenario-Bo.png'
import { EventCalendar } from "../components/calendar";
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { format } from 'date-fns';

export const Inicio = () => {
    
      const { t, i18n } = useTranslation();
      const [events, setEvents] = useState([]);
      const [selectedEvent, setSelectedEvent] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [selectedSlot, setSelectedSlot] = useState(null);

      const fetchEvents = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/eventos');
          if (!response.ok) {
            throw new Error('Error al obtener los eventos');
          }
          const data = await response.json();
          setEvents(data);
        } catch (err) {
          setError(err.message);
        }
      };

      useEffect(() => {
        fetchEvents();
      }, []);

    const formattedEvents = events.map(event => ({
    id: event.id_evento || event.id,
    title: event.nombre || event.title,
    start: new Date(event.fecha_hora || event.fecha || event.start),
    end: new Date(event.fecha_hora ?
      new Date(event.fecha_hora).setHours(new Date(event.fecha_hora).getHours() + 2) :
      event.end || new Date(event.fecha).setHours(new Date(event.fecha).getHours() + 2)),
    desc: event.descripcion || event.description,
    tipo: event.tipo || event.type
  }));

      const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
      };
      const handleSlotSelect = (slotInfo) => {
        setSelectedSlot({
          start: slotInfo.start,
          end: slotInfo.end,
          fecha: format(slotInfo.start, 'yyyy-MM-dd'),
          hora: format(slotInfo.start, 'HH:mm')
        });
        setShowModal(true);
      };
      return (
        <>
          <h1>Página de Inicio</h1>
      <img src={logo} alt="Pie de página Bolivia" className="footer-image" />
          <p>Esta es la primera página del sitio web</p>
    
                <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Calendario de Eventos</h2>
            <EventCalendar
              events={formattedEvents}
              onEventSelect={handleEventSelect}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        </>
      );
}