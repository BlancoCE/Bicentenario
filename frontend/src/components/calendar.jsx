import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import esLocale from 'date-fns/locale/es';
import enUSLocale from 'date-fns/locale/en-US';

const locales = {
  es: esLocale,
  en: enUSLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const EventCalendar = ({ events, onEventSelect, onSlotSelect }) => {
  const { i18n } = useTranslation();
  const [localEvents, setLocalEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = events.map(event => {
      const fechaHora = event.fecha_hora || `${event.fecha}T${event.hora}`;
      const startDate = new Date(fechaHora);
      const endDate = new Date(new Date(fechaHora).setHours(startDate.getHours() + 2));
      return {
        id: event.id_evento,
        title: event.nombre,
        start: startDate,
        end: endDate,
        desc: event.descripcion,
        lugar: event.lugar,
        tipo: event.tipo,
        allDay: false,
      };
    });
    setLocalEvents(formattedEvents);
  }, [events]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';

    switch (event.tipo) {
      case 'Cultural':
        backgroundColor = '#004d40';
        break;
      case 'Académico':
        backgroundColor = '#5e35b1';
        break;
      case 'Deportivo':
        backgroundColor = '#e65100';
        break;
      case 'Social':
        backgroundColor = '#0277bd';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  return (
    <div style={{ height: '700px', marginTop: '20px' }}>
      <Calendar
  localizer={localizer}
  events={localEvents}
  startAccessor="start"
  endAccessor="end"
  style={{ height: '100%' }}
  onSelectEvent={onEventSelect}
  onSelectSlot={onSlotSelect}
  selectable={true}
  eventPropGetter={eventStyleGetter}
  messages={{
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
  }}
  culture={i18n.language}
/>
    </div>
  );
};
