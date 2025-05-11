const express = require('express');
const axios = require('axios');
const { query, getEvents, getEventSpeakers, getEventAgenda } = require('../db');
const router = express.Router();

// Función para detectar intenciones
const detectIntent = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  return {
    isEventQuery: /evento|actividad|acto|celebración|programa/i.test(lowerQuestion),
    isSpeakerQuery: /expositor|ponente|conferencista|charlista/i.test(lowerQuestion),
    isAgendaQuery: /agenda|horario|cronograma|programación/i.test(lowerQuestion),
    isLocationQuery: /dónde|ubicación|lugar|dirección|mapa/i.test(lowerQuestion),
    isDateQuery: /cuándo|fecha|día|hora/i.test(lowerQuestion),
    location: lowerQuestion.match(/en (la paz|cochabamba|santa cruz|sucre|oruro|potosí|tarija|beni|pando)/i)?.[1] || 
              lowerQuestion.match(/en (\w+)/i)?.[1],
    date: lowerQuestion.match(/(\d{1,2}\/\d{1,2}\/\d{4})|(\d{1,2} de [a-z]+)/i)?.[0]
  };
};

// Formateadores de respuestas
const formatEventsResponse = (events) => {
  if (!events.length) return "No encontré eventos con esos criterios.";

  let response = "🎉 Estos son los eventos que encontré:\n\n";
  events.forEach(event => {
    response += `• **${event.nombre}**\n`;
    response += `  📅 ${new Date(event.fecha).toLocaleDateString('es-BO')}\n`;
    response += `  📍 ${event.ubicacion || event.departamento || 'Ubicación por confirmar'}\n`;
    response += `  ℹ️ ${event.descripcion?.substring(0, 100)}${event.descripcion?.length > 100 ? '...' : ''}\n\n`;
  });
  return response;
};

const formatSpeakersResponse = (speakers, eventName) => {
  if (!speakers.length) return `No encontré expositores para el evento ${eventName}.`;

  let response = `👨‍🏫 Expositores de ${eventName}:\n\n`;
  speakers.forEach(speaker => {
    response += `• **${speaker.nombre}**\n`;
    response += `  🎤 Tema: ${speaker.tema}\n`;
    response += `  🏛️ ${speaker.institucion}\n`;
    response += `  🎓 ${speaker.especialidad}\n\n`;
  });
  return response;
};

const formatAgendaResponse = (agendaItems, eventName) => {
  if (!agendaItems.length) return `No encontré agenda para el evento ${eventName}.`;

  let response = `⏰ Agenda de ${eventName}:\n\n`;
  agendaItems.forEach(item => {
    response += `• ${new Date(item.fecha).toLocaleString('es-BO')}: ${item.actividades}\n`;
  });
  return response;
};

// Consultas a la base de datos
const handleEventQuery = async (intent) => {
  const options = {};
  if (intent.location) options.location = intent.location;
  if (intent.date) options.date = intent.date;
  
  return await getEvents(options);
};

const handleSpeakerQuery = async (question) => {
  // Extraer nombre de evento si se menciona
  const eventMatch = question.match(/evento (.*)/i) || 
                     question.match(/de (.*)/i) ||
                     question.match(/para (.*)/i);
  
  if (eventMatch) {
    const eventName = eventMatch[1];
    const events = await getEvents({ limit: 1 });
    if (events.length) {
      return await getEventSpeakers(events[0].id_evento);
    }
  }
  return [];
};

const handleAgendaQuery = async (question) => {
  const eventMatch = question.match(/evento (.*)/i) || 
                     question.match(/de (.*)/i);
  
  if (eventMatch) {
    const eventName = eventMatch[1];
    const events = await getEvents({ limit: 1 });
    if (events.length) {
      return await getEventAgenda(events[0].id_evento);
    }
  }
  return [];
};

// Generador de respuestas
const generateResponse = async (question) => {
  const intent = detectIntent(question);
  
  // Consultas específicas a la base de datos
  if (intent.isEventQuery) {
    const events = await handleEventQuery(intent);
    return formatEventsResponse(events);
  }
  
  if (intent.isSpeakerQuery) {
    const speakers = await handleSpeakerQuery(question);
    const eventName = question.match(/evento (.*)/i)?.[1] || "el evento";
    return formatSpeakersResponse(speakers, eventName);
  }
  
  if (intent.isAgendaQuery) {
    const agendaItems = await handleAgendaQuery(question);
    const eventName = question.match(/evento (.*)/i)?.[1] || "el evento";
    return formatAgendaResponse(agendaItems, eventName);
  }
  
  // Preguntas generales que requieren IA
  const prompt = `[INST] Eres BoliviaBot, asistente del Bicentenario de Bolivia. 
  Responde de manera concisa (máximo 3 oraciones) en español coloquial.
  
  Contexto:
  - Base de datos con eventos, expositores y agendas
  - Fechas importantes: 6 de agosto 2025 (acto central)

  Regla:
  - Si alguien te pide informacion de los eventos tienes que responder de manera ordenada
  
  Pregunta: ${question} [/INST]`;

  try {
    const response = await axios.post(
      'https://api.deepinfra.com/v1/inference/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        input: prompt,
        max_new_tokens: 150,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    return response.data.results[0].generated_text;
  } catch (error) {
    console.error('Error al consultar IA:', error);
    return "Disculpa, estoy teniendo problemas para responder. ¿Podrías reformular tu pregunta?";
  }
};

// Ruta principal
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.length < 3) {
      return res.status(400).json({ 
        response: "Por favor, escribe una pregunta más específica." 
      });
    }

    const response = await generateResponse(question);
    res.json({ response });
    
  } catch (error) {
    console.error('Error en el endpoint /chat:', error);
    res.status(500).json({ 
      response: "Ocurrió un error interno. Por favor, intenta nuevamente más tarde." 
    });
  }
});

module.exports = router;