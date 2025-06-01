import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/configuracionc.css';
import userLogo from '../assets/user-logo.png';
import { FaEye, FaEyeSlash, FaSave, FaTimes, FaUpload, FaTrash, FaBars } from 'react-icons/fa';
import { fetchWithAuth } from '../utils/api';

export const ConfiguracionC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        pais: '',
        ciudad: '',
    });

    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);
    const location = useLocation();

    // Cerrar menú al hacer clic fuera en moviles
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth <= 992 && 
                isMenuOpen && 
                menuRef.current && 
                !menuRef.current.contains(event.target) && 
                !hamburgerRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                setLoading(true);
                const data = await fetchWithAuth('https://bicentenario-production.up.railway.app/api/usuario/perfil');
                setUserData({
                    nombre: data.nombre || 'NOMBRE DE USUARIO',
                    correo: data.correo || 'ejemplo@gmail.com',
                    telefono: data.telefono || 'Sin teléfono',
                    pais: data.pais || 'Sin ubicación',
                    ciudad: data.ciudad || 'Sin ciudad',
                });
            } catch (err) {
                setError(err.message);
                if (err.message.includes('401')) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        obtenerPerfil();
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleEdit = (field) => {
        setEditField(field);
        setEditedValue(userData[field]);
    };

    const handleSave = async (field) => {
        try {
            setUserData({ ...userData, [field]: editedValue });
            setEditField(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setEditField(null);
    };

    const handleChange = (e) => {
        setEditedValue(e.target.value);
    };

    const handleRemovePhoto = () => {
        setProfilePhoto(null);
    };

    const handleUploadPhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContinue = () => {
        closeModal();
        setEditField(modalType);
    };


    if (error) {
        return (
            <div className="profile-container">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="profile-container">

            {/* Contenido principal */}
            <div className="profile-cont">
                <h1>Tu perfil</h1>
                
                {/* Foto de perfil */}
                <div className="profile-section">
                    <div className="section-title">Foto de perfil</div>
                    <div className="profile-photo">
                        <img 
                            src={profilePhoto || userLogo} 
                            alt="Foto de perfil" 
                            className="profile-image" 
                        />
                        <div className="photo-actions">
                            <button 
                                className="action-button danger" 
                                onClick={handleRemovePhoto}
                                disabled={!profilePhoto}
                            >
                                <FaTrash /> Eliminar foto
                            </button>
                            <input 
                                type="file" 
                                id="upload-photo" 
                                accept="image/*" 
                                onChange={handleUploadPhoto} 
                                style={{ display: 'none' }} 
                            />
                            <label 
                                htmlFor="upload-photo" 
                                className="action-button primary"
                            >
                                <FaUpload /> Cambiar foto
                            </label>
                        </div>
                    </div>
                </div>

                {/* Nombre */}
                <div className="profile-section">
                    <div className="section-title">Nombre</div>
                    <div className="section-content">
                        {editField === 'nombre' ? (
                            <div className="edit-fields">
                                <input 
                                    type="text" 
                                    value={editedValue} 
                                    onChange={handleChange} 
                                    placeholder="Ingresa tu nombre"
                                />
                                <div className="edit-buttons">
                                    <button 
                                        className="action-button primary" 
                                        onClick={() => handleSave('nombre')}
                                    >
                                        <FaSave /> Guardar
                                    </button>
                                    <button 
                                        className="action-button" 
                                        onClick={handleCancel}
                                    >
                                        <FaTimes /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="field-value">
                                    {userData.nombre || 'No especificado'}
                                </div>
                                <button 
                                    className="edit-button" 
                                    onClick={() => handleEdit('nombre')}
                                >
                                    Editar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Correo electrónico */}
                <div className="profile-section">
                    <div className="section-title">Correo electrónico</div>
                    <div className="section-content">
                        {editField === 'correo' ? (
                            <div className="edit-fields">
                                <input 
                                    type="email" 
                                    value={editedValue} 
                                    onChange={handleChange} 
                                    placeholder="Ingresa tu correo"
                                />
                                <div className="edit-buttons">
                                    <button 
                                        className="action-button primary" 
                                        onClick={() => handleSave('correo')}
                                    >
                                        <FaSave /> Guardar
                                    </button>
                                    <button 
                                        className="action-button" 
                                        onClick={handleCancel}
                                    >
                                        <FaTimes /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="field-value">{userData.correo}</div>
                                <button 
                                    className="edit-button" 
                                    onClick={() => openModal('correo')}
                                >
                                    Editar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Contraseña */}
                <div className="profile-section">
                    <div className="section-title">Contraseña</div>
                    <div className="section-content">
                        <div className="field-value">••••••••••</div>
                        <button 
                            className="edit-button" 
                            onClick={() => openModal('password')}
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="profile-section">
                    <div className="section-title">Teléfono</div>
                    <div className="section-content">
                        {editField === 'telefono' ? (
                            <div className="edit-fields">
                                <input 
                                    type="tel" 
                                    value={editedValue} 
                                    onChange={handleChange} 
                                    placeholder="Ingresa tu teléfono"
                                />
                                <div className="edit-buttons">
                                    <button 
                                        className="action-button primary" 
                                        onClick={() => handleSave('telefono')}
                                    >
                                        <FaSave /> Guardar
                                    </button>
                                    <button 
                                        className="action-button" 
                                        onClick={handleCancel}
                                    >
                                        <FaTimes /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="field-value">
                                    {userData.telefono || 'No especificado'}
                                </div>
                                <button 
                                    className="edit-button" 
                                    onClick={() => handleEdit('telefono')}
                                >
                                    Editar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Ubicación */}
                <div className="profile-section">
                    <div className="section-title">Ubicación</div>
                    <div className="section-content">
                        {editField === 'ubicacion' ? (
                            <div className="edit-fields">
                                <input 
                                    type="text" 
                                    value={editedValue} 
                                    onChange={handleChange} 
                                    placeholder="País"
                                    style={{ marginBottom: '10px' }}
                                />
                                <input 
                                    type="text" 
                                    value={editedValue} 
                                    onChange={handleChange} 
                                    placeholder="Ciudad"
                                />
                                <div className="edit-buttons">
                                    <button 
                                        className="action-button primary" 
                                        onClick={() => handleSave('pais')}
                                    >
                                        <FaSave /> Guardar
                                    </button>
                                    <button 
                                        className="action-button" 
                                        onClick={handleCancel}
                                    >
                                        <FaTimes /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="field-value">
                                    {userData.ciudad && userData.pais 
                                        ? `${userData.ciudad}, ${userData.pais}`
                                        : 'No especificada'}
                                </div>
                                <button 
                                    className="edit-button" 
                                    onClick={() => handleEdit('ubicacion')}
                                >
                                    Editar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Idioma */}
                <div className="profile-section">
                    <div className="section-title">Idioma</div>
                    <div className="section-content">
                        <select className="type-use">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="qu">Quechua</option>
                            <option value="ay">Aymara</option>
                        </select>
                    </div>
                </div>

                <div className="use-message">
                    Estamos personalizando tu experiencia para que se adapte mejor a tus necesidades. 
                    Puedes cambiar esta configuración en cualquier momento.
                </div>
            </div>

            {/* Modal para correo y contraseña */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>
                            {modalType === 'correo' 
                                ? 'Cambiar correo electrónico' 
                                : 'Cambiar contraseña'}
                        </h2>
                        <p>
                            {modalType === 'correo'
                                ? 'Para cambiar tu correo electrónico, te enviaremos un código de verificación a tu dirección actual.'
                                : 'Para cambiar tu contraseña, te enviaremos un código de verificación a tu correo electrónico.'}
                        </p>
                        
                        <input 
                            type="text" 
                            placeholder="Código de verificación" 
                            className="verification-input"
                            maxLength="6"
                        />
                        
                        <button 
                            className="verification-button" 
                            onClick={handleContinue}
                        >
                            Continuar
                        </button>
                        
                        <p className="verification-resend">
                            ¿No recibiste el código? <a href="#">Reenviar código</a> (30s)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};