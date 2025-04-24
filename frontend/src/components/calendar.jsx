import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/EventCalendar.css';

const locales = { es, en: enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const EventCalendar = ({ events = [], onEventSelect, onSlotSelect }) => {
  const { i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const formattedEvents = useMemo(() => {
    return events.map(event => {
      const startDate = new Date(event.start);
      const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      return {
        ...event,
        id: event.id || Math.random().toString(36).substr(2, 9),
        title: event.title || 'Evento sin título',
        start: startDate,
        end: endDate,
        desc: event.desc || '',
        tipo: event.tipo || 'General',
        allDay: event.allDay || false,
      };
    });
  }, [events]);

  const eventStyleGetter = (event) => {
    const colors = {
      Cultural: '#004d40',
      Académico: '#5e35b1',
      Academico: '#5e35b1',
      Deportivo: '#e65100',
      Social: '#0277bd',
      General: '#3174ad'
    };

    return {
      style: {
        backgroundColor: colors[event.tipo] || colors.General,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  const handleNavigate = (newDate, view) => {
    setCurrentDate(newDate);
    if (view) {
      setCurrentView(view);
    }
  };

  const CustomToolbar = ({ label }) => {
    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button 
            type="button" 
            onClick={() => handleNavigate(addMonths(currentDate, -1))} 
            className="rbc-nav-button"
          >
            ◄ Anterior
          </button>
          <button 
            type="button" 
            onClick={() => handleNavigate(new Date())} 
            className="rbc-today-button"
          >
            Hoy
          </button>
          <button 
            type="button" 
            onClick={() => handleNavigate(addMonths(currentDate, 1))} 
            className="rbc-nav-button"
          >
            Siguiente ►
          </button>
        </div>

        <span className="rbc-toolbar-label">{label}</span>

        <div className="rbc-btn-group">
          <button 
            type="button" 
            onClick={() => handleNavigate(currentDate, 'month')} 
            className={`rbc-view-button ${currentView === 'month' ? 'rbc-active' : ''}`}
          >
            Mes
          </button>
          <button 
            type="button" 
            onClick={() => handleNavigate(currentDate, 'week')} 
            className={`rbc-view-button ${currentView === 'week' ? 'rbc-active' : ''}`}
          >
            Semana
          </button>
          <button 
            type="button" 
            onClick={() => handleNavigate(currentDate, 'day')} 
            className={`rbc-view-button ${currentView === 'day' ? 'rbc-active' : ''}`}
          >
            Día
          </button>
          <button 
            type="button" 
            onClick={() => handleNavigate(currentDate, 'agenda')} 
            className={`rbc-view-button ${currentView === 'agenda' ? 'rbc-active' : ''}`}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onEventSelect}
        onSelectSlot={onSlotSelect}
        selectable={true}
        eventPropGetter={eventStyleGetter}
        onNavigate={handleNavigate}
        onView={handleNavigate}
        view={currentView}
        date={currentDate}
        culture={i18n.language}
        messages={{
          today: 'Hoy',
          previous: '◄',
          next: '►',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este período.',
        }}
        components={{
          toolbar: CustomToolbar
        }}
      />
    </div>
  );
};