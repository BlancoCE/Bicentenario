import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import logo from '../assets/Bicentenario-Bo.png';
import { EventCalendar } from "../components/calendar";
import EventCarousel from "../components/5eventos";
import '../styles/contador.css';
import '../styles/inicio.css';

export const Inicio = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fecha objetivo: 6 de agosto
  const targetDate = new Date(new Date().getFullYear(), 7, 6);

  // Actualizar contador cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = {
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60
      };
      setCountdown(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/eventos');
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
      <div className="header-section">
        <div className="countdown-background">
          <div className="countdown-overlay">
            <div className="countdown-content">
              <h2>Faltan:</h2>
              <div className="countdown-container">
                <div className="countdown-box">
                  <span className="countdown-value">{countdown.days}</span>
                  <span className="countdown-label">Días</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-value">{countdown.hours}</span>
                  <span className="countdown-label">Horas</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-value">{countdown.minutes}</span>
                  <span className="countdown-label">Minutos</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-value">{countdown.seconds}</span>
                  <span className="countdown-label">Segundos</span>
                </div>
              </div>
              <h2>para el Bicentenario</h2>
              
            </div>
          </div>
        </div>
      </div>
      <EventCarousel />
      <div className="calendar-section">
        <h2 className="calendar-title">Calendario de Eventos</h2>
        <EventCalendar
          events={formattedEvents}
          onEventSelect={handleEventSelect}
          onSlotSelect={handleSlotSelect}
        />
      </div>
    </>
  );
};