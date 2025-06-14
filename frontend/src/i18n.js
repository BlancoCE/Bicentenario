import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Traducciones en los cuatro idiomas
const resources = {
  es: {
    translation: {
      "Inicio": "Inicio",
      "Contacto": "Contacto",
      "Registrarse": "Registrarse",
      "Iniciar Sesión": "Iniciar Sesión",
      "Cerrar sesión": "Cerrar sesión",
      "Idioma": "Idioma",
      "Bienvenido!": "Bienvenido a la página del Bicentenario",
      "Pagina de Inicio": "Pagina de Inicio",
      "Calendario de Eventos": "Calendario de Eventos",
      "Nombre": "Nombre",
      "Correo Electronico": "Correo Electronico",
      "Contraseña": "Contraseña",
      "Confirmar Contraseña": "Confirmar contraseña",
      "Telefono": "Telefono",
      "Selecciona tu género": "Selecciona tu género",
      "Masculino": "Masculino",
      "Femenino": "Femenino",
      "Selecciona un país": "Selecciona un país",
      "Selecciona una ciudad": "Selecciona una ciudad",
      "Crear Cuenta": "Crear Cuenta",
      "eventos.titulo": "Eventos",
      "eventos.buscar": "Buscar",
      "eventos.todos_tipos": "Tipos",
      "eventos.todas_modalidades": "Modalidad",
      "eventos.mas_info": "Mas información",
      "eventos.suscribirse": "Suscribirse",
      "eventos.pasado": "Pasado",
      "eventos.no_eventos": "Sin eventos",
    }
  },
  en: {
    translation: {
      "Inicio": "Home",
      "Contacto": "Contact",
      "Registrarse": "Sign Up",
      "Iniciar Sesión": "Login",
      "Cerrar sesión": "Logout",
      "Idioma": "Language",
      "Bienvenido": "Welcome to the Bicentennial page",
      "Agenda": "Agenda2"
    }
  },
  ay: {
    translation: {
      "Inicio": "Qalltaña",
      "Contacto": "Jikxataña",
      "Registrarse": "Qillqaña",
      "Iniciar Sesión": "Jutiri uñt’ayaña",
      "Cerrar sesión": "Mistuña",
      "Idioma": "Aru",
      "Bienvenido!": "Bicentenario pʼanqata jikisita",
      "Pagina de Inicio": "Qalltaña p’anqa",
      "Calendario de Eventos": "Uñacht’awinakapa urunaka",
      "Nombre": "Suti",
      "Correo Electronico": "Correo electrónico",
      "Contraseña": "Chʼamañchawi",
      "Confirmar Contraseña": "Chʼamañchawi irpaña",
      "Telefono": "Jiwaki uñt’awi",
      "Selecciona tu género": "Jiskhtʼam mayjtʼawi",
      "Masculino": "Chacha",
      "Femenino": "Warmi",
      "Selecciona un país": "Marka ajlliñataki",
      "Selecciona una ciudad": "Jachʼa marka ajlliñataki",
      "Crear Cuenta": "Qillqata uñt’ayaña",
    }
  },
  qu: {
    translation: {
      "Inicio": "Qallariy",
      "Contacto": "Tinkuy",
      "Registrarse": "Qillqay",
      "Iniciar Sesión": "Yachay wasipi yaykuy",
      "Cerrar sesión": "Lloqsisqa",
      "Idioma": "Simi",
      "Bienvenido": "Bicentenario p’anqata rimay",
      "Agenda": "Kalindaryu",
    }
  }
};

// Inicializar i18next
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "es", // Guardar idioma seleccionado
  fallbackLng: "es", // Si no encuentra traducción, usa español por defecto
  interpolation: { escapeValue: false },
});

// Función para cambiar y guardar idioma en LocalStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
