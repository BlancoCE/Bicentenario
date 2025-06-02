import {useParams, useNavigate, redirect} from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import "../styles/registroevento.css";
import { postWithAuth } from '../utils/api';

export function EventRegister(){
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [event, setEvent] = useState(null);
    const a=1;

    useEffect(() => {
        checkAuth();
        fetchEvent();
    }, [eventId]);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if(token){
            setIsAuthenticated(true);
        }
    };

    const fetchEvent = async () => {
        const response = await fetch(`https://bicentenario-production.up.railway.app/api/eventos/${eventId}`);
        const data = await response.json();
        setEvent(data);
    };

    const handleRegister = async() => {
        if(!isAuthenticated){
            navigate('/#/login', { state: { redirect: `/#/events/${eventId}/register`}});
            return;
        }

        try{
            const response = await postWithAuth(
            `https://bicentenario-production.up.railway.app/api/eventos/${eventId}/register`,
            {} // Objeto vacío o datos requeridos
        );
        
        alert('¡Inscripción Exitosa!');
        }catch(error){
            alert(error);
            console.error('Error: ', error);
        }
    };

    return(
        <div className='register-page'>
            {event && (
                <>
                    
                    <h1>Inscripcion a: {event.nombre}</h1>
                    <p>{event.descripcion}</p>

                    {isAuthenticated ? (
                        <button onClick={handleRegister} className='register-btn'>
                            Confirmar Inscripcion
                        </button>
                    ) : (
                        <div>
                            <p>Debes iniciar sesión para inscribirte</p>
                            <button onClick={() => navigate('/login', {state: {redirect: `/#/eventos/${eventId}`}})}>Aqui</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}