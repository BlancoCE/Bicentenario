import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/Agente.css';

export const Agente = () => {
  const [messages, setMessages] = useState(() => {
    // Cargar historial desde localStorage al inicializar
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { 
        text: "¡Hola! Soy tu asistente virtual del Bicentenario de Bolivia. ¿En qué puedo ayudarte hoy?", 
        sender: 'bot' 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugerencias de preguntas frecuentes
  const suggestions = [
    "¿Cuándo es el Bicentenario de Bolivia?",
    "¿Qué eventos habrá para el Bicentenario?",
    "¿Cuál es la importancia histórica del Bicentenario?",
    "¿Dónde se realizarán los principales eventos?",
    "¿Cómo puedo participar en las celebraciones?"
  ];

  // Scroll automático al fondo del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Guardar historial en localStorage cuando cambia
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping) return;

    // Agregar mensaje del usuario
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setIsBotTyping(true);
    try {
      // Obtener respuesta del backend
      const botResponse = await getBotResponse(input);
      
      // Agregar respuesta del bot
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMessages(prev => [...prev, { 
        text: "Lo siento, estoy teniendo dificultades para responder. Por favor intenta más tarde.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const getBotResponse = async (userInput) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat', // Ruta completa
        { question: userInput },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      return response.data.response;
    } catch (error) {
      console.error("Error completo:", {
        request: error.request,
        response: error.response?.data
      });
      throw error;
    }
  };

  // Función para manejar preguntas frecuentes
  const checkFAQs = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('cuándo') || lowerInput.includes('fecha')) {
      return "El Bicentenario de Bolivia se celebra el 6 de agosto de 2025, conmemorando 200 años de independencia.";
    }
    
    if (lowerInput.includes('eventos') || lowerInput.includes('actividades')) {
      return "Habrá eventos culturales, desfiles históricos, exposiciones y conferencias en todo el país. ¡Pronto publicaremos el calendario oficial!";
    }
    
    if (lowerInput.includes('importancia') || lowerInput.includes('significado')) {
      return "El Bicentenario marca 200 años de vida independiente, una oportunidad para reflexionar sobre nuestra historia y proyectar el futuro de Bolivia.";
    }
    
    return null;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Asistente Virtual del Bicentenario</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isBotTyping && (
          <div className="message bot typing-indicator">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias de preguntas 
      <div className="suggestions-container">
        {suggestions.map((suggestion, i) => (
          <button 
            key={i} 
            className="suggestion-btn"
            onClick={() => setInput(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>*/}
      
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre el Bicentenario de Bolivia..."
          disabled={isBotTyping}
        />
        <button type="submit" disabled={isBotTyping || !input.trim()}>
          {isBotTyping ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};
