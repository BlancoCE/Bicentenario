import sinImagen from '../assets/sinimagen.jpg';
import React, { useState, useEffect } from 'react';
import { EventCalendar } from "./calendar";
import { uploadImage } from "../firebase/firebaseStorage";
import { format } from 'date-fns';

export const Eventos = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expositores, setExpositores] = useState([]);
    const [patrocinadores, setPatrocinadores] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({
        users: 0,
        events: 0,
        comments: 0,
        resources: 0
    });
    const [newEvent, setNewEvent] = useState({
        nombre: '',
        fecha: '',
        fecha2: '',
        hora: '',
        hora2: '',
        modalidad: '',
        ubicacion: '',
        ubicacion2: '',
        enlace: '',
        tipo: '',
        descripcion: '',
        numero: '',
        imagen: '',
        expositor: '',
        patrocinador: '',
    });
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/eventos');
            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }
            const data = await response.json();
            setEvents(data);

            const response2 = await fetch('http://localhost:5000/api/expositores');
            if (!response2.ok) {
                throw new Error('Error al obtener los expositores');
            }
            const data2 = await response2.json();
            setExpositores(data2);

            const response3 = await fetch('http://localhost:5000/api/patrocinadores');
            if (!response3.ok) {
                throw new Error('Error al obtener los expositores');
            }
            const data3 = await response3.json();
            setPatrocinadores(data3);
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Datos de ejemplo
                setStats({
                    users: 0,
                    events: 0,
                    comments: 0,
                    resources: 0
                });

                // Obtener eventos reales desde la API
                await fetchEvents();


                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar los datos");
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const fetchEventById = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventos/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el evento');
            }
            const data = await response.json();
            setCurrentEvent(data);
            setIsEditing(true);
        } catch (err) {
            setError(err.message);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Si es un campo de fecha/hora, asegurarse de mantener el formato correcto
        if (name === 'fecha' || name === 'fecha2') {
            setCurrentEvent(prev => ({
                ...prev,
                [name]: value ? new Date(value).toISOString().split('T')[0] : ''
            }));
        } else {
            setCurrentEvent(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const cancelarEdicion = () => {
        setIsEditing(false);
        setEditingEventId(null);
        setCurrentEvent(null);
    };
    const guardarEvento = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/eventos/${editingEventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentEvent),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el evento');
            }

            const updatedEvent = await response.json();

            // Actualizar la lista de eventos con el evento actualizado
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    (event.id_evento === editingEventId || event.id === editingEventId)
                        ? updatedEvent
                        : event
                )
            );

            // Cerrar el panel de edición
            setIsEditing(false);
            setEditingEventId(null);
            setCurrentEvent(null);
        } catch (error) {
            console.error('Error actualizando evento:', error);
            alert('No se pudo actualizar el evento');
        }
    };
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
    const eliminarEvento = async (id) => {
        if (!window.confirm('¿Está seguro que desea eliminar este evento?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/eventos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el evento');
            }

            // Actualizar la lista de eventos después de eliminar
            setEvents(prevEvents => prevEvents.filter(event =>
                (event.id_evento !== id && event.id !== id)
            ));

            if (editingEventId === id) {
                setEditingEventId(null);
                setIsEditing(false);
                setCurrentEvent(null);
            }
        } catch (error) {
            console.error('Error eliminando evento:', error);
            alert('No se pudo eliminar el evento');
        }
    };
    const crearEvento = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/eventos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newEvent, imagen: newEvent.imagen || null }),
            });
            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }
            const data = await response.json();

            // Actualizar la lista de eventos
            setEvents([...events, data]);

            // Cerrar el modal y resetear el formulario
            setShowAddModal(false);
            setNewEvent({
                nombre: '',
                fecha: '',
                tipo: '',
                descripcion: '',
                ubicacion: ''
            });
        } catch (error) {
            console.error('Error creando evento:', error);
            alert('No se pudo crear el evento');
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            // 1. Subir imagen
            const imageUrl = await uploadImage(file);
            // 2. Actualizar el estado del evento
            setNewEvent(prev => ({ ...prev, imagen: imageUrl }));

            // Opcional: Mostrar vista previa
            // setPreviewImage(imageUrl);

        } catch (error) {
            alert("Error al subir la imagen: " + error.message);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no definida';

        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        } catch {
            return dateString; // Si hay error al parsear, devolver el string original
        }
    };
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
        <div className="crud-section">
            <div className="section-header">
                <h2>Lista de Eventos</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <i className="bi bi-plus-circle"></i> Nuevo Evento
                </button>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr key={event.id || event._id}>
                                    <td>
                                        <img
                                            src={event.imagen || event.image || sinImagen}
                                            alt="Portada del evento"
                                            className="event-thumbnail"
                                            onError={(e) => {
                                                e.target.src = sinImagen; // Fallback por si la URL de la imagen es inválida
                                            }}
                                        />
                                    </td>
                                    <td>{event.nombre || event.name || 'Sin nombre'}</td>
                                    <td>{formatDate(event.fecha || event.date)}</td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setEditingEventId(event.id_evento || event.id);
                                                fetchEventById(event.id_evento || event.id);
                                            }}
                                        >
                                            <i className="bi bi-pencil"></i> Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => eliminarEvento(event.id_evento || event.id)}
                                        >
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay eventos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Panel de edición de eventos */}
            {isEditing && currentEvent && (
                <div className="edit-panel">
                    <div className="edit-panel-content">
                        <div className="edit-panel-header">
                            <h3>Editar Evento</h3>
                            <button
                                className="btn btn-close"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingEventId(null);
                                    setCurrentEvent(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={guardarEvento}>
                            <div className="mb-3">
                                <label htmlFor="edit-nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="edit-nombre"
                                    name="nombre"
                                    value={currentEvent.nombre || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edit-fecha" className="form-label">Fecha Inicio</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="edit-fecha"
                                    name="fecha"
                                    value={currentEvent.fecha ? format(new Date(currentEvent.fecha), 'yyyy-MM-dd') : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edit-fecha2" className="form-label">Fecha Final</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="edit-fecha2"
                                    name="fecha2"
                                    value={currentEvent.fecha_final ? format(new Date(currentEvent.fecha_final), 'yyyy-MM-dd') : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="edit-hora" className="form-label">Hora Inicio</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="edit-hora"
                                    name="hora"
                                    value={currentEvent.hora ? currentEvent.hora.substring(0, 5) : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edit-hora2" className="form-label">Hora Final</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="edit-hora2"
                                    name="hora2"
                                    value={currentEvent.hora_final ? currentEvent.hora_final.substring(0, 5) : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="edit-tipo" className="form-label">Tipo</label>
                                <select
                                    className="form-select"
                                    id="edit-tipo"
                                    name="tipo"
                                    value={currentEvent.tipo || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Académico">Académico</option>
                                    <option value="Deportivo">Deportivo</option>
                                    <option value="Social">Social</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="edit-descripcion" className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    id="edit-descripcion"
                                    name="descripcion"
                                    rows="3"
                                    value={currentEvent.descripcion || ''}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Modalidad</label>
                                <div className="modalidad-options">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="modalidad"
                                            id="presencial"
                                            value="presencial"
                                            checked={newEvent.modalidad === 'presencial'}
                                            onChange={() => setNewEvent({ ...newEvent, modalidad: 'presencial' })}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="presencial">
                                            Presencial
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="modalidad"
                                            id="virtual"
                                            value="virtual"
                                            checked={newEvent.modalidad === 'virtual'}
                                            onChange={() => setNewEvent({ ...newEvent, modalidad: 'virtual' })}
                                        />
                                        <label className="form-check-label" htmlFor="virtual">
                                            Virtual
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="edit-ubicacion" className="form-label">Ubicación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="edit-ubicacion"
                                    name="ubicacion"
                                    value={currentEvent.lugar || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="edit-panel-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelarEdicion}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal para agregar nuevo evento */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Agregar Nuevo Evento</h3>
                            <button
                                className="btn btn-close"
                                onClick={() => setShowAddModal(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={crearEvento}>
                            <div className="mb-3">
                                <label htmlFor="new-nombre" className="form-label">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="new-nombre"
                                    name="nombre"
                                    value={newEvent.nombre}
                                    onChange={(e) => setNewEvent({ ...newEvent, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="new-fecha-inicio" className="form-label">Fecha Inicio</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="new-fecha-inicio"
                                                name="fecha"
                                                value={newEvent.fecha}
                                                onChange={(e) => setNewEvent({ ...newEvent, fecha: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="new-hora-inicio" className="form-label">Hora Inicio</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="new-hora-inicio"
                                                name="hora"
                                                value={newEvent.hora}
                                                onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="new-fecha-fin" className="form-label">Fecha Final</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="new-fecha-fin"
                                                name="fecha2"
                                                value={newEvent.fecha2}
                                                onChange={(e) => setNewEvent({ ...newEvent, fecha2: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="new-hora-fin" className="form-label">Hora Final</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="new-hora-fin"
                                                name="hora2"
                                                value={newEvent.hora2}
                                                onChange={(e) => setNewEvent({ ...newEvent, hora2: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="new-expositor" className="form-label">Expositor</label>
                                <select
                                    className="form-select"
                                    id="new-expositor"
                                    name="expositor"
                                    value={newEvent.expositor || ''}
                                    onChange={(e) => setNewEvent({ ...newEvent, expositor: e.target.value })}
                                >
                                    <option value="">Seleccione un expositor...</option>
                                    {expositores.map(expositor => (
                                        <option
                                            key={expositor.id_expositor}
                                            value={expositor.id_expositor}
                                        >
                                            {expositor.nombre || 'N/A'}
                                        </option>
                                    ))}
                                    <option value="">Añadir...</option>
                                </select>
                            </div>



                            <div className='mb-3'>
                                <label htmlFor="new-expositor" className="form-label">Patrocinador</label>
                                <select
                                    className="form-select"
                                    id="new-patrocinador"
                                    name="patrocinador"
                                    value={newEvent.patrocinador || ''}
                                    onChange={(e) => setNewEvent({ ...newEvent, patrocinador: e.target.value })}
                                >
                                    <option value="">Seleccione un patrocinador...</option>
                                    {patrocinadores.map(patrocinador => (
                                        <option
                                            key={patrocinador.id_patrocinador}
                                            value={patrocinador.id_patrocinador}
                                        >
                                            {patrocinador.institucion || 'N/A'}
                                        </option>
                                    ))}
                                    <option value="">Añadir...</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Modalidad</label>
                                <div className="modalidad-options">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="modalidad"
                                            id="presencial"
                                            value="presencial"
                                            checked={newEvent.modalidad === 'presencial'}
                                            onChange={() => setNewEvent({ ...newEvent, modalidad: 'presencial' })}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="presencial">
                                            Presencial
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="modalidad"
                                            id="virtual"
                                            value="virtual"
                                            checked={newEvent.modalidad === 'virtual'}
                                            onChange={() => setNewEvent({ ...newEvent, modalidad: 'virtual' })}
                                        />
                                        <label className="form-check-label" htmlFor="virtual">
                                            Virtual
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {newEvent.modalidad === 'presencial' && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="new-ubicacion" className="form-label">Ubicación Presencial</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="new-ubicacion"
                                            name="ubicacion"
                                            value={newEvent.ubicacion}
                                            onChange={(e) => setNewEvent({ ...newEvent, ubicacion: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="new-coordenadas" className="form-label">Coordenadas (opcional)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="new-coordenadas"
                                            name="ubicacion2"
                                            placeholder="Ej: -16.5000, -68.1500"
                                            value={newEvent.ubicacion2}
                                            onChange={(e) => setNewEvent({ ...newEvent, ubicacion2: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {newEvent.modalidad === 'virtual' && (
                                <div className="mb-3">
                                    <label htmlFor="new-enlace" className="form-label">Enlace Virtual</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="new-enlace"
                                        name="enlace"
                                        placeholder="https://meet.google.com/xyz-abcd-123"
                                        value={newEvent.enlace}
                                        onChange={(e) => setNewEvent({ ...newEvent, enlace: e.target.value })}
                                        required
                                    />
                                </div>
                            )}


                            <div className="mb-3">
                                <label htmlFor="new-tipo" className="form-label">Tipo de Evento</label>
                                <select
                                    className="form-select"
                                    id="new-tipo"
                                    name="tipo"
                                    value={newEvent.tipo}
                                    onChange={(e) => setNewEvent({ ...newEvent, tipo: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Académico">Académico</option>
                                    <option value="Deportivo">Deportivo</option>
                                    <option value="Social">Social</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="new-descripcion" className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    id="new-descripcion"
                                    name="descripcion"
                                    rows="3"
                                    value={newEvent.descripcion}
                                    onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="new-descripcion" className="form-label">Número de Contacto</label>
                                <input
                                    type='number'
                                    className="form-control"
                                    id="new-descripcion"
                                    name="numero"
                                    value={newEvent.numero}
                                    onChange={(e) => setNewEvent({ ...newEvent, numero: e.target.value })}
                                ></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="new-imagen" className="form-label">Imagen del Evento</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="new-imagen"
                                    name="imagen"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {newEvent.imagen && (
                                    <div className="mt-2">
                                        <img
                                            src={newEvent.imagen}
                                            alt="Vista previa"
                                            style={{ maxHeight: '150px' }}
                                            className="img-thumbnail"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger mt-2"
                                            onClick={() => setNewEvent({ ...newEvent, imagen: '' })}
                                        >
                                            <i className="bi bi-trash"></i> Eliminar imagen
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Crear Evento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )
            }
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Calendario de Eventos</h2>
                <EventCalendar
                    events={formattedEvents}
                    onEventSelect={handleEventSelect}
                    onSlotSelect={handleSlotSelect}
                />
            </div>
        </div >
    )
}